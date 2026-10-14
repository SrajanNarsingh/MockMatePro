const base=(import.meta.env.VITE_API_BASE_URL||'').replace(/\/$/,'');
const sample={
'Frontend Developer':['What is the difference between controlled and uncontrolled components in React?','How would you improve performance in a slow React application?','Explain local state versus global state.'],
'Backend Developer':['What is middleware in Express.js?','How should an API validate incoming data?','Explain authentication versus authorization.'],
'Full Stack Developer':['What happens after a user submits a form in a full-stack app?','How would you handle errors between frontend and backend?','How would you model an interview session in MongoDB?'],
'Data Analyst':['How would you handle missing data?','Explain INNER JOIN versus LEFT JOIN.','How would you explain an unexpected trend in a dashboard?']
};
async function req(path,opts={}){const r=await fetch(base+path,{...opts,headers:{'Content-Type':'application/json',...(opts.headers||{})}});const j=await r.json().catch(()=>({}));if(!r.ok)throw Error(j.message||`Request failed (${r.status})`);return j}
export async function createInterview({role,difficulty}){if(!base)return {_id:'demo-'+Date.now(),role,difficulty,demoMode:true,questions:(sample[role]||sample['Full Stack Developer']).map((text,i)=>({id:'q'+(i+1),text}))};const d=await req('/api/interviews',{method:'POST',body:JSON.stringify({role,difficulty})});return {...d,questions:(d.questions||[]).map((q,i)=>typeof q==='string'?{id:'q'+(i+1),text:q}:{id:q.id||q._id||'q'+(i+1),text:q.text||q.question||''})}}
export async function submitAnswer({interviewId,questionId,question,answer}){if(!base||String(interviewId).startsWith('demo-')){const n=answer.trim().split(/\\s+/).filter(Boolean).length;return {score:Math.min(9,Math.max(4,Math.round(4+n/18))),feedback:n<12?'Your answer needs more detail. Add a specific example and explain your reasoning.':'Your answer has a useful explanation. Strengthen it by describing your approach, result, and what you learned.',demoMode:true}}return req(`/api/interviews/${encodeURIComponent(interviewId)}/answers`,{method:'POST',body:JSON.stringify({questionId,question,answer})})}
export const apiConfigured=()=>Boolean(base);
