// supabase-client.js — basic save
function supa(){ return window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }

async function signOut(){ await supa().auth.signOut(); }

async function supaSaveJob(payload){
  const s = supa();
  const { data: { user } } = await s.auth.getUser();
  const owner = user?.id || null;

  // Ensure customer
  let custId = null;
  if (payload.customer?.email){
    const { data: exist } = await s.from('customers').select('id').eq('email', payload.customer.email).limit(1);
    if (exist && exist.length) custId = exist[0].id;
  }
  if (!custId){
    const { data: c } = await s.from('customers').insert([{ ...payload.customer, owner }]).select().single();
    custId = c.id;
  }

  const { data: job, error: e1 } = await s.from('jobs').insert([{
    owner, customer_id: custId,
    art_desc: payload.job.art_desc,
    storage_loc: payload.job.storage_loc,
    width_in: payload.job.width_in,
    height_in: payload.job.height_in,
    allowance_in: payload.job.allowance_in,
    tax_pct: payload.job.tax_pct,
    labor: payload.job.labor,
    grand_text: payload.job.grand,
    due_date: payload.job.due_date
  }]).select().single();
  if (e1) throw e1;

  if (payload.mouldings?.length){
    const rows = payload.mouldings.map((m,i)=>({ job_id: job.id, position:i, item:m.item||'', ppft:m.ppft||0 }));
    const { error: e2 } = await s.from('job_mouldings').insert(rows);
    if (e2) throw e2;
  }
  if (payload.specials?.length){
    const rows = payload.specials.map((sp,i)=>({ job_id: job.id, position:i, descr:sp.descr||'', unit:sp.unit||0, qty:sp.qty||0 }));
    const { error: e3 } = await s.from('job_specials').insert(rows);
    if (e3) throw e3;
  }
  return job;
}
