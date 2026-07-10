function initUniRowListeners(){
  document.querySelectorAll('.uni-row').forEach(function(row){
    let newRow = row.cloneNode(true);
    row.parentNode.replaceChild(newRow, row);
    newRow.addEventListener('click', function(e){
      if(e.target.tagName === 'BUTTON') return;
      let name = newRow.dataset.name || '';
      openUniModal(name, {});
    });
  });
}

{
  "@context":"https://schema.org",
  "@type":"EducationalOrganization",
  "name":"Abreams",
  "description":"China University Admissions and Scholarship Partner Network",
  "url":"https://abreams.com",
  "sameAs":[]
}

function showPage(id){
  try{
    document.querySelectorAll('.page').forEach(p=>p.classList.remove('active'));
    let el=document.getElementById('page-'+id);
    if(el){el.classList.add('active');}
    window.scrollTo({top:0,behavior:'smooth'});
    if(id==='universities') filterUnis();
  } catch(e){ console.error('showPage error:',e); }
}
let GOOGLE_SHEET_URL='https://script.google.com/macros/s/AKfycbw7p30e8qPduhoIAy4PyiU3d9tMsDNpNBEmtaLFJmrvN67Vpib--DAV69LJLPMnnfjshQ/exec';

function showApplyModal(){
  document.getElementById('applyModal').style.display='flex';
  document.getElementById('applyFormView').style.display='block';
  document.getElementById('applySuccessView').style.display='none';
  document.getElementById('applyError').style.display='none';
}
function closeApplyModal(){
  document.getElementById('applyModal').style.display='none';
}
document.getElementById('applyModal').addEventListener('click',function(e){
  if(e.target===this)closeApplyModal();
});
function submitApplyForm(){
  let firstName=document.getElementById('apply_firstName').value.trim();
  let lastName=document.getElementById('apply_lastName').value.trim();
  let email=document.getElementById('apply_email').value.trim();
  let whatsapp=document.getElementById('apply_whatsapp').value.trim();
  let program=document.getElementById('apply_programLevel').value;
  let field=document.getElementById('apply_fieldOfStudy').value.trim();
  let scholarship=document.getElementById('apply_scholarshipNeed').value;
  let errEl=document.getElementById('applyError');
  if(!firstName||!lastName){showApplyError('Please enter your full name.');return;}
  if(!email||!email.includes('@')){showApplyError('Please enter a valid email address.');return;}
  if(!whatsapp){showApplyError('Please enter your WhatsApp number so we can reach you.');return;}
  let btn=document.getElementById('applySubmitBtn');
  btn.disabled=true;btn.textContent='Submitting...';errEl.style.display='none';
  let payload={firstName:firstName,lastName:lastName,email:email,whatsapp:whatsapp,
    programLevel:program||'Not specified',fieldOfStudy:field||'Not specified',scholarshipNeed:scholarship};
  fetch(GOOGLE_SHEET_URL,{method:'POST',mode:'no-cors',
    headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
  .then(function(){
    document.getElementById('applyFormView').style.display='none';
    document.getElementById('applySuccessView').style.display='block';
    ['apply_firstName','apply_lastName','apply_email','apply_whatsapp','apply_fieldOfStudy'].forEach(function(id){
      document.getElementById(id).value='';
    });
    btn.disabled=false;btn.textContent='Submit Application →';
  })
  .catch(function(){
    showApplyError('Something went wrong. Please try again or contact us on WhatsApp.');
    btn.disabled=false;btn.textContent='Submit Application →';
  });
}
function showApplyError(msg){
  let el=document.getElementById('applyError');
  el.textContent='⚠️ '+msg;el.style.display='block';
}
function toggleMobileMenu(){
  let m=document.getElementById('mobileMenu');
  m.style.display=m.style.display==='flex'?'none':'flex';
}
function closeMobileMenu(){
  document.getElementById('mobileMenu').style.display='none';
}
function toggleMobStudyDD(el){
  let sub=document.getElementById('mobStudySub');
  let arrow=el.querySelector('.dd-arrow');
  sub.classList.toggle('open');
  arrow.style.transform=sub.classList.contains('open')?'rotate(180deg)':'rotate(0deg)';
}
// Close desktop dropdown when clicking outside
document.addEventListener('click',function(e){
  let dd=document.getElementById('studyDropdown');
  if(dd&&!dd.contains(e.target))dd.classList.remove('open');
});
window.addEventListener('scroll',function(){
  let nav=document.getElementById('mainNav');
  nav.classList.toggle('scrolled',window.scrollY>30);
});
function toggleFaq(el){
  let item=el.parentElement;
  item.classList.toggle('open');
}
function filterPrograms(cat,btn){
  document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.program-card').forEach(function(card){
    if(cat==='all'||card.dataset.cat.indexOf(cat)>-1){
      card.style.display='';
    }else{
      card.style.display='none';
    }
  });
}
let activeUniTag='';
function filterUnis(){try{
  let search=(document.getElementById('uniSearch').value||'').toLowerCase().trim();
  let level=(document.getElementById('uniLevel').value||'').toLowerCase().trim();
  let stream=(document.getElementById('uniStream').value||'').toLowerCase().trim();
  let duration=(document.getElementById('uniDuration').value||'').trim();
  let shown=0;

  // Loop every uni-row in both containers and show/hide
  document.querySelectorAll('#uniGrid .uni-row, #uniListWrap .uni-row').forEach(function(row){
    let name   = (row.dataset.name     || '').toLowerCase();
    let rTags  = (row.dataset.tags     || '').toLowerCase();
    let rLevel = (row.dataset.level    || '').toLowerCase();
    let rStream= (row.dataset.stream   || '').toLowerCase();
    let rDur   = (row.dataset.duration || '');

    // Search: match name OR tags OR meta text
    let metaEl = row.querySelector('.uni-row-meta');
    let meta   = metaEl ? metaEl.textContent.toLowerCase() : '';
    let matchSearch = !search ||
      name.includes(search) ||
      meta.includes(search) ||
      rTags.includes(search);

    // Level: data-level may contain multiple e.g. "bachelor master phd"
    let matchLevel = !level || rLevel.split(/[\s,]+/).indexOf(level) !== -1;

    // Stream: data-stream may contain multiple e.g. "engineering medicine"
    let matchStream = !stream || rStream.split(/[\s,]+/).indexOf(stream) !== -1;

    // Duration: data-duration may contain multiple e.g. "4 5 6"
    let matchDuration = !duration || rDur.split(/[\s,]+/).indexOf(duration) !== -1;

    let visible = matchSearch && matchLevel && matchStream && matchDuration;
    row.style.display = visible ? '' : 'none';
    if(visible) shown++;
  });

  // Show/hide empty state
  let empty = document.getElementById('uniEmpty');
  if(empty) empty.style.display = shown === 0 ? 'block' : 'none';

  // Update count
  let countEl = document.getElementById('uniCountNum');
  if(countEl) countEl.textContent = shown === 0 ? '0' : shown;

  // Update active filter pills
  let pills = document.getElementById('activePills');
  if(pills){
    pills.innerHTML = '';
    let labels = {
      'level':    {'bachelor':'Bachelor','master':'Master','phd':'PhD','chinese':'Chinese Language'},
      'stream':   {'engineering':'Engineering','medicine':'Medicine / MBBS','business':'Business','technology':'Technology','science':'Science','arts':'Arts & Humanities','language':'Language'},
      'duration': {'4':'4 Years','5':'5 Years','6':'6 Years'}
    };
    [['level',level],['stream',stream],['duration',duration]].forEach(function(pair){
      if(pair[1]){
        let pill = document.createElement('span');
        pill.style.cssText = 'background:var(--blue);color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:50px;display:inline-flex;align-items:center;gap:6px;cursor:pointer';
        pill.innerHTML = (labels[pair[0]][pair[1]] || pair[1]) + ' <span style="opacity:.7">✕</span>';
        pill.onclick = (function(id){ return function(){ document.getElementById(id).value=''; filterUnis(); }; })('uni' + pair[0].charAt(0).toUpperCase() + pair[0].slice(1));
        pills.appendChild(pill);
      }
    });
    // Search pill
    if(search){
      let spill = document.createElement('span');
      spill.style.cssText = 'background:var(--navy);color:#fff;font-size:12px;font-weight:600;padding:4px 12px;border-radius:50px;display:inline-flex;align-items:center;gap:6px;cursor:pointer';
      spill.innerHTML = '🔍 ' + search + ' <span style="opacity:.7">✕</span>';
      spill.onclick = function(){ document.getElementById('uniSearch').value=''; filterUnis(); };
      pills.appendChild(spill);
    }
  }
  } catch(e){ console.error('filterUnis error:',e); }
}
function filterUniTag(tag,el){
  activeUniTag=tag;
  document.querySelectorAll('.filter-tag').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
  filterUnis();
}
function resetUniFilters(){
  document.getElementById('uniSearch').value='';
  document.getElementById('uniLevel').value='';
  document.getElementById('uniStream').value='';
  document.getElementById('uniDuration').value='';
  activeUniTag='';
  document.querySelectorAll('.filter-tag').forEach(t=>t.classList.remove('active'));
  let first=document.querySelector('.filter-tag');
  if(first)first.classList.add('active');
  filterUnis();
}
// Hide wa tooltip after 4s
setTimeout(function(){
  let t=document.querySelector('.wa-tooltip');
  if(t)t.style.display='none';
},4000);

// University data — embedded for offline + online compatibility
const uniData = {"Peking University": {"loc": "📍 Beijing", "qs": "QS #17", "tier": "Project 985", "logo": "https://logo.clearbit.com/pku.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Science"], "duration": ["4 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS", "Engineering", "Science", "Law"]}, "Tsinghua University": {"loc": "📍 Beijing", "qs": "QS #25", "tier": "Project 985", "logo": "https://logo.clearbit.com/tsinghua.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Technology", "Business", "Science"], "duration": ["4 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBA", "Engineering", "Computer Science", "Business"]}, "Fudan University": {"loc": "📍 Shanghai", "qs": "QS #39", "tier": "Project 985", "logo": "https://logo.clearbit.com/fudan.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Business", "Science", "Arts"], "duration": ["4 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBA", "Business", "Economics", "Arts"]}, "Zhejiang University": {"loc": "📍 Hangzhou, Zhejiang", "qs": "QS #47", "tier": "Project 985", "logo": "https://logo.clearbit.com/zju.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Business"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship", "ZIBS HAI Scholarship", "Zhejiang Govt Scholarship"], "programs": ["MBBS (6 Yrs)", "Engineering", "MBA"]}, "Wuhan University": {"loc": "📍 Wuhan, Hubei", "qs": "QS Top 300", "tier": "Project 985", "logo": "https://logo.clearbit.com/whu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Medicine", "Engineering", "Science"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Engineering", "Science"]}, "Capital Medical University": {"loc": "📍 Beijing", "qs": "Medical Top 5", "tier": "Key Medical University", "logo": "https://logo.clearbit.com/ccmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Stomatology", "Pharmacy", "Nursing"]}, "China Medical University": {"loc": "📍 Shenyang, Liaoning", "qs": "Medical Top 20", "tier": "Key University", "logo": "https://logo.clearbit.com/cmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["5 Years", "6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS (5 Yrs)"]}, "Dalian Medical University": {"loc": "📍 Dalian, Liaoning", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/dmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS (5 Yrs)", "Pharmacy"]}, "Nanjing Medical University": {"loc": "📍 Nanjing, Jiangsu", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/njmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Pharmacy", "Nursing"]}, "Wenzhou Medical University": {"loc": "📍 Wenzhou, Zhejiang", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/wzmc.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Ophthalmology", "Pharmacy"]}, "Southern Medical University": {"loc": "📍 Guangzhou, Guangdong", "qs": "Medical University", "tier": "Key Medical University", "logo": "https://logo.clearbit.com/smu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing", "Pharmacy"]}, "Chongqing Medical University": {"loc": "📍 Chongqing", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/cqmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing", "Pharmacy"]}, "Xuzhou Medical University": {"loc": "📍 Xuzhou, Jiangsu", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/xzhmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Anesthesiology", "Pharmacy"]}, "Southeast University": {"loc": "📍 Nanjing, Jiangsu", "qs": "QS Top 400", "tier": "Project 985", "logo": "https://logo.clearbit.com/seu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Electrical Eng", "Civil Eng"]}, "Shandong University": {"loc": "📍 Jinan, Shandong", "qs": "QS Top 400", "tier": "Project 985", "logo": "https://logo.clearbit.com/sdu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Medicine", "Business", "Engineering"], "duration": ["6 Years", "2 Years"], "scholarship": ["University Scholarship"], "programs": ["MBBS (6 Yrs)", "MBA", "Engineering"]}, "Huazhong University of Science and Technology": {"loc": "📍 Wuhan, Hubei", "qs": "QS Top 200", "tier": "Project 985", "logo": "https://logo.clearbit.com/hust.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Mechanical Eng", "Electronics"]}, "an Jiaotong University": {"loc": "📍 Xi'an, Shaanxi", "qs": "QS Top 200", "tier": "Project 985", "logo": "https://logo.clearbit.com/xjtu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Business"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Engineering", "MBA"]}, "Soochow University": {"loc": "📍 Suzhou, Jiangsu", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/suda.edu.cn", "levels": ["Bachelor", "Master"], "streams": ["Medicine", "Science"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Pharmacy", "Nanoscience"]}, "Sichuan University": {"loc": "📍 Chengdu, Sichuan", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/scu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Medicine", "Engineering"], "duration": ["5 Years", "6 Years"], "scholarship": ["CSC & Sichuan Govt Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS (5 Yrs)", "Engineering", "MBA"]}, "Xiamen University": {"loc": "📍 Xiamen, Fujian", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/xmu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Medicine", "Science", "Business"], "duration": ["6 Years", "4 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Economics", "Science"]}, "Zhengzhou University": {"loc": "📍 Zhengzhou, Henan", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/zzu.edu.cn", "levels": ["Bachelor", "Master"], "streams": ["Medicine", "Engineering", "Business"], "duration": ["6 Years", "3 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Engineering", "Business"]}, "Fujian Medical University": {"loc": "📍 Fuzhou, Fujian", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/fjmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years", "5 Years"], "scholarship": ["Fujian Govt Scholarship", "Outstanding Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS Stomatology (5 Yrs)", "Pharmacy"]}, "Anhui Medical University": {"loc": "📍 Hefei, Anhui", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ahmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Pharmacy", "Nursing"]}, "Hebei Medical University": {"loc": "📍 Shijiazhuang, Hebei", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/hebmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing", "Pharmacy"]}, "Guangzhou Medical University": {"loc": "📍 Guangzhou, Guangdong", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/gzhmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing"]}, "Kunming Medical University": {"loc": "📍 Kunming, Yunnan", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/kmmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Pharmacy"]}, "Jinzhou Medical University": {"loc": "📍 Jinzhou, Liaoning", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/jzmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing"]}, "Ningxia Medical University": {"loc": "📍 Yinchuan, Ningxia", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/nxmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing", "Pharmacy"]}, "Jiangsu University": {"loc": "📍 Zhenjiang, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ujs.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine", "Engineering"], "duration": ["6 Years"], "scholarship": ["JSU Presidential Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS (6 Yrs)", "Pharmacy"]}, "Shantou University": {"loc": "📍 Shantou, Guangdong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/stu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Nursing"]}, "Qingdao University": {"loc": "📍 Qingdao, Shandong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/qdu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Shihezi University": {"loc": "📍 Shihezi, Xinjiang", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/shzu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Yangzhou University": {"loc": "📍 Yangzhou, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/yzu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine", "Engineering", "Business"], "duration": ["6 Years"], "scholarship": ["NA"], "programs": ["MBBS (6 Yrs)", "Microelectronics Science &Engineering", "Software Engineering", "Civil Engineering", "Biotechnology", "International Business", "Tourism Management"]}, "Ningbo University": {"loc": "📍 Ningbo, Zhejiang", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/nbu.edu.cn", "levels": ["Bachelor", "Master"], "streams": ["Medicine", "Business"], "duration": ["6 Years", "2.5 Years"], "scholarship": ["Zhejiang Govt Scholarship", "Ningbo Govt Scholarship", "University Scholarship"], "programs": ["MBBS (6 Yrs)", "MBA"]}, "China Three Gorges University": {"loc": "📍 Yichang, Hubei", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ctgu.edu.cn", "levels": ["Bachelor", "Master"], "streams": ["Medicine", "Business"], "duration": ["6 Years", "2 Years"], "scholarship": ["Hubei Govt Scholarship"], "programs": ["MBBS (6 Yrs)", "MBA"]}, "Zhejiang Normal University": {"loc": "📍 Jinhua, Zhejiang", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/zjnu.edu.cn", "levels": ["Master"], "streams": ["Business", "Arts"], "duration": ["2 Years"], "scholarship": ["Zhejiang Govt Scholarship", "University Scholarship"], "programs": ["MBA", "Education", "Arts"]}, "Chongqing University": {"loc": "📍 Chongqing", "qs": "QS Top 600", "tier": "Project 985", "logo": "https://logo.clearbit.com/cqu.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Chongqing Municipal Govt, President Scholarship"], "programs": ["MBA", "Engineering"]}, "Tianjin University": {"loc": "📍 Tianjin", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/tju.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Tianjin Govt Scholarship"], "programs": ["MBA", "Engineering"]}, "Shanghai University of Finance and Economics": {"loc": "📍 Shanghai", "qs": "Top Finance School", "tier": "Project 211", "logo": "https://logo.clearbit.com/shufe.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Finance", "Accounting"]}, "Tongji University": {"loc": "📍 Shanghai", "qs": "QS Top 300", "tier": "Project 985", "logo": "https://logo.clearbit.com/tongji.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Check Brochure"], "programs": ["MBA", "Engineering", "Architecture"]}, "Shanghai Jiao Tong University": {"loc": "📍 Shanghai", "qs": "QS #51", "tier": "Project 985", "logo": "https://logo.clearbit.com/sjtu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Business"], "duration": ["2 Years", "4 Years"], "scholarship": ["Check Brochure"], "programs": ["MBA", "MBBS", "Engineering"]}, "Dalian Maritime University": {"loc": "📍 Dalian, Liaoning", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/dlmu.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["University Scholarship"], "programs": ["MBA", "Maritime Engineering"]}, "Central China Normal University": {"loc": "📍 Wuhan, Hubei", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/ccnu.edu.cn", "levels": ["Master"], "streams": ["Business", "Arts"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Education", "Arts"]}, "Wuhan Textile University": {"loc": "📍 Wuhan, Hubei", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/wtu.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["University Scholarship"], "programs": ["MBA"]}, "Zhongnan University of Economics and Law": {"loc": "📍 Wuhan, Hubei", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/zuel.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["Freshman Scholarship"], "programs": ["MBA", "Law", "Economics"]}, "South China University of Technology": {"loc": "📍 Guangzhou, Guangdong", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/scut.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Guangdong Govt & University Scholarship"], "programs": ["MBA", "Engineering"]}, "North China University of Technology": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ncut.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Beijing Govt & President Scholarship"], "programs": ["MBA", "Engineering"]}, "Beijing Technology and Business University": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/btbu.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship"], "programs": ["MBA", "Business"]}, "Renmin University of China": {"loc": "📍 Beijing", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/ruc.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Economics", "Law"]}, "Beijing Institute of Technology": {"loc": "📍 Beijing", "qs": "QS Top 600", "tier": "Project 985", "logo": "https://logo.clearbit.com/bit.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship"], "programs": ["MBA", "Engineering"]}, "Beijing Jiaotong University": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/bjtu.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship"], "programs": ["MBA", "Engineering", "Transport"]}, "University of International Business and Economics": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/uibe.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship (30,000 RMB)"], "programs": ["MBA", "International Trade", "Economics", "Finance"]}, "Jilin University": {"loc": "📍 Changchun, Jilin", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/jlu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Business", "Engineering", "Medicine"], "duration": ["2 Years", "4 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBA", "MBBS", "Engineering"]}, "Jinan University": {"loc": "📍 Guangzhou, Guangdong", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/jnu.edu.cn", "levels": ["Bachelor", "Master"], "streams": ["Medicine", "Business"], "duration": ["6 Years", "2 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "Pharmacy", "MBA"]}, "China Europe International Business School": {"loc": "📍 Shanghai", "qs": "FT Global MBA #1 in China", "tier": "Elite Business School", "logo": "https://logo.clearbit.com/ceibs.edu", "levels": ["Master"], "streams": ["Business"], "duration": ["16 Months"], "scholarship": ["—"], "programs": ["Full-Time MBA", "Executive MBA"]}, "Tianjin University of Science and Technology": {"loc": "📍 Tianjin", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/tust.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA"]}, "Xidian University": {"loc": "📍 Xi'an, Shaanxi", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/xidian.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Computer Science and Technology", "Information and Computational Science", "Applied Physics"]}, "Nanjing University of Posts and Telecommunications": {"loc": "📍 Nanjing, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/njupt.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Telecom Engineering"]}, "Beijing Normal University Zhuhai": {"loc": "📍 Zhuhai, Guangdong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/bnuz.edu.cn", "levels": ["Master"], "streams": ["Business", "Arts"], "duration": ["2 Years"], "scholarship": ["University Scholarship"], "programs": ["MBA", "Education"]}, "Sanya Institute of China Agricultural University": {"loc": "📍 Sanya, Hainan", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/cau.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["CSC & China Agricultural Univ. Scholarship"], "programs": ["MBA"]}, "Harbin Medical University": {"loc": "📍 Harbin, Heilongjiang", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/hrbmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "North Sichuan Medical University": {"loc": "📍 Nanchong, Sichuan", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/nsmc.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["Sichuan Govt Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Southwest Medical University": {"loc": "📍 Luzhou, Sichuan", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/swmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["Sichuan Govt Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Tianjin Medical University": {"loc": "📍 Tianjin", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/tmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Xinjiang Medical University": {"loc": "📍 Urumqi, Xinjiang", "qs": "Medical University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/xjmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "Nantong University": {"loc": "📍 Nantong, Jiangsu", "qs": "Medical Program", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ntu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["Jiangsu Govt Scholarship"], "programs": ["MBBS (6 Yrs)"]}, "China Medical University, PRC": {"loc": "📍 Shenyang, Liaoning", "qs": "Medical Top 10", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/cmu.edu.cn", "levels": ["Bachelor"], "streams": ["Medicine"], "duration": ["6 Years"], "scholarship": ["CSC Scholarship"], "programs": ["MBBS (6 Yrs)", "BDS (5 Yrs)", "Pharmacy"]}, "Shanghai Univ. of Finance & Economics": {"loc": "📍 Shanghai", "qs": "Top Finance School", "tier": "Project 211", "logo": "https://logo.clearbit.com/shufe.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Finance", "Accounting", "International Trade"]}, "Shanghai Jiaotong University": {"loc": "📍 Shanghai", "qs": "QS #51", "tier": "Project 985", "logo": "https://logo.clearbit.com/sjtu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Business"], "duration": ["2 Years", "4 Years"], "scholarship": ["Check Brochure"], "programs": ["MBA", "MBBS", "Engineering", "CS & AI"]}, "Zhongnan Univ. of Economics & Law": {"loc": "📍 Wuhan, Hubei", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/zuel.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["Freshman Scholarship (Type B & C)"], "programs": ["MBA", "Economics", "Law", "Finance"]}, "South China Univ. of Technology": {"loc": "📍 Guangzhou, Guangdong", "qs": "QS Top 500", "tier": "Project 985", "logo": "https://logo.clearbit.com/scut.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Guangdong Govt Scholarship (20,000 RMB)", "University Scholarship"], "programs": ["MBA", "Engineering", "Architecture"]}, "North China Univ. of Technology": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ncut.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship (Full & Partial)", "President Scholarship"], "programs": ["MBA", "Mechanical Eng", "Civil Eng"]}, "Beijing Technology & Business Univ.": {"loc": "📍 Beijing", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/btbu.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["Beijing Govt Scholarship (Full & Partial Tuition)"], "programs": ["MBA", "Business Administration", "Marketing"]}, "Tianjin Univ. of Science & Technology": {"loc": "📍 Tianjin", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/tust.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Food Science", "Chemical Engineering"]}, "Nanjing Univ. of Post & Telecom": {"loc": "📍 Nanjing, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/njupt.edu.cn", "levels": ["Master"], "streams": ["Business", "Engineering"], "duration": ["2 Years"], "scholarship": ["—"], "programs": ["MBA", "Telecom Engineering", "CS & IoT"]}, "Beijing Normal University (Zhuhai)": {"loc": "📍 Zhuhai, Guangdong", "qs": "Key University", "tier": "Project 985", "logo": "https://logo.clearbit.com/bnuz.edu.cn", "levels": ["Master"], "streams": ["Business", "Arts"], "duration": ["2 Years"], "scholarship": ["University Scholarship (Full & Partial)"], "programs": ["MBA", "Education", "Arts & Media"]}, "Sanya Inst. of China Agricultural Univ.": {"loc": "📍 Sanya, Hainan", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/cau.edu.cn", "levels": ["Master"], "streams": ["Business"], "duration": ["2 Years"], "scholarship": ["CSC Scholarship", "China Agricultural Univ. Scholarship (Merit, Type A & B)"], "programs": ["MBA"]}, "Chongqing University of Posts and Telecommunications": {"loc": "📍 Chongqing", "qs": "Key University", "tier": "Project 211", "logo": "https://logo.clearbit.com/cqupt.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["CQUPT President Scholarship (6,000 RMB/Year)"], "programs": ["Computer Science and Technology", "Marketing", "English"]}, "Nanjing University of Science and Technology": {"loc": "📍 Nanjing, Jiangsu", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/njust.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["NJUST Scholarship (Type A+: Tuition+Accommodation+Stipend 1,000 RMB/Month, Type A: Tuition, Type B: 50% Tuition, Type C: Accommodation)"], "programs": ["International Economics and Trade", "Software Engineering", "Mechanical Engineering"]}, "Nanjing University of Aeronautics and Astronautics": {"loc": "📍 Nanjing, Jiangsu", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/nuaa.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["NUAA Fly-High Scholarship (Full Tuition Waiver)"], "programs": ["International Business and Trade", "Mechanical Engineering", "Electrical and Electronics Engineering", "Artificial Intelligence", "Civil Engineering", "Aeronautical Engineering"]}, "University of Science and Technology Beijing": {"loc": "📍 Beijing", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/ustb.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering"], "duration": ["4 Years"], "scholarship": ["USTB Chancellor Scholarship (Full: Tuition+Accommodation+Medical+Stipend, Partial: one or more items)"], "programs": ["Environmental Engineering", "Materials Science and Engineering"]}, "China University of Geosciences Wuhan": {"loc": "📍 Wuhan, Hubei", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/cug.edu.cn", "levels": ["Bachelor"], "streams": ["Business"], "duration": ["4 Years"], "scholarship": ["CUG President Scholarship (Type A: Full Tuition, Type B: Half Tuition)"], "programs": ["Business Management"]}, "Nanjing University of Information Science and Technology": {"loc": "📍 Nanjing, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/nuist.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business", "Science"], "duration": ["4 Years"], "scholarship": ["NUIST Excellent Freshmen Scholarship (Full/Partial Tuition)", "Nanjing Government Scholarship (10,000 RMB/year)"], "programs": ["Artificial Intelligence", "Computer Science and Technology", "Electronic Information Engineering", "International Economy and Trade", "Atmospheric Science"]}, "China University of Petroleum Qingdao": {"loc": "📍 Qingdao, Shandong", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/upc.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering"], "duration": ["4 Years"], "scholarship": ["Local Govt Scholarship (Type A: Tuition+Accommodation, Type B: Tuition, Type C: Half Tuition)", "University Scholarship (same coverage)"], "programs": ["Petroleum Engineering", "Mechanical Design Manufacturing and Automation", "Software Engineering", "Resource Exploration Engineering", "Geology"]}, "Nanjing Tech University": {"loc": "📍 Nanjing, Jiangsu", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/njtech.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["NIT Scholarship (1st Year: 20,000 RMB, 2nd Year: up to 20,000 RMB)", "Nanjing City Government Scholarship (10,000 RMB/year)"], "programs": ["International Economy and Trade", "Computer Science and Technology", "Chemical Engineering and Technics", "Civil Engineering", "Mechanical Engineering", "Traffic Engineering", "Automation", "Pharmacy"]}, "North China Electric Power University": {"loc": "📍 Beijing", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/ncepu.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["Beijing Government Scholarship (Full/Partial Tuition)", "International Education Scholarship (same coverage)"], "programs": ["New Energy Science and Engineering", "Electrical Engineering and its Automation", "Business Administration", "Mechanical Engineering"]}, "Zhejiang University of Technology": {"loc": "📍 Hangzhou, Zhejiang", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/zjut.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business", "Science"], "duration": ["4 Years"], "scholarship": ["Zhejiang Provincial Government Scholarship (Tuition)", "ZJUT Scholarship (Tuition)"], "programs": ["Pharmaceutical Science", "Electrical Engineering and Automation", "Business Management", "Mechanical Engineering", "Software Engineering", "Finance", "Applied Chemistry", "Civil Engineering", "Computer Science and Technology", "International Economics and Trade", "Chemical Engineering and Technology", "Environmental Engineering"]}, "Guangdong University of Technology": {"loc": "📍 Guangzhou, Guangdong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/gdut.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["Government Scholarship (10,000 RMB/year)", "GDUT Scholarship (10,000 RMB/year)"], "programs": ["Computer Science and Technology", "International Economics and Trade"]}, "an": {"loc": "📍 Xi'an, Shaanxi", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/nwu.edu.cn", "levels": ["Bachelor"], "streams": ["Business"], "duration": ["4 Years"], "scholarship": ["NWU International Students Scholarship (Type A: Tuition+Accommodation, Type B: Tuition, Type C: Partial Tuition)", "Shaanxi Provincial Government (13,000 RMB/Year)"], "programs": ["International Economics and Trade"]}, "Shandong University of Science and Technology": {"loc": "📍 Qingdao, Shandong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/sdust.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering"], "duration": ["4 Years"], "scholarship": ["SDUST Scholarship (Full Tuition / Partial Tuition / 5,000 RMB)", "Shandong Provincial Government Scholarship", "Qingdao Municipal Government Scholarship", "Belt and Road Scholarship"], "programs": ["Mechatronic Engineering", "Telecommunications Engineering", "Chemical Engineering and Technology", "Software Engineering", "Civil Engineering"]}, "China Pharmaceutical University": {"loc": "📍 Nanjing, Jiangsu", "qs": "Project 211", "tier": "Project 211", "logo": "https://logo.clearbit.com/cpu.edu.cn", "levels": ["Bachelor"], "streams": ["Business", "Science"], "duration": ["4 Years"], "scholarship": ["Nanjing Government Scholarship (10,000 RMB/Year)", "CPU President Scholarship (International Economics: 19,000 RMB/Year, Pharmacy: 20,000 RMB/Year)", "Jiangsu Government Scholarship"], "programs": ["International Economics and Trade", "Clinical Pharmacy", "Pharmacy"]}, "Yanshan University": {"loc": "📍 Qinhuangdao, Hebei", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/ysu.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Arts"], "duration": ["4 Years"], "scholarship": ["Hebei Provincial Government Scholarship (5,000 RMB)", "YSU President Scholarship (16,000 RMB)"], "programs": ["Product Design", "Petroleum Engineering", "English"]}, "Shandong Normal University": {"loc": "📍 Jinan, Shandong", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/sdnu.edu.cn", "levels": ["Bachelor"], "streams": ["Business"], "duration": ["4 Years"], "scholarship": ["Shandong Provincial Government Scholarship"], "programs": ["Business Administration", "Labor and Social Security"]}, "Kunming University of Science and Technology": {"loc": "📍 Kunming, Yunnan", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/kmust.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business"], "duration": ["4 Years"], "scholarship": ["Yunnan Provincial Government Scholarship (Tuition+Accommodation+Medical+Stipend: 1,400 RMB/Month)", "Freshman Scholarship (Tuition 3,000 RMB + Stipend: 1,000 RMB/Month for 10 months)"], "programs": ["International Economics and Trade", "Metallurgical Engineering", "New Energy Science and Engineering", "Electrical Engineering and Automation"]}, "Zhejiang Sci-Tech University": {"loc": "📍 Hangzhou, Zhejiang", "qs": "Key University", "tier": "Provincial Key", "logo": "https://logo.clearbit.com/zstu.edu.cn", "levels": ["Bachelor"], "streams": ["Engineering", "Business", "Science"], "duration": ["4 Years"], "scholarship": ["Zhejiang Provincial Government Scholarship (20,000 RMB)", "ZSTU Freshmen Scholarship (Full Tuition)"], "programs": ["Mechanical Design Manufacturing and Automation", "Biotechnology", "Computer Science and Technology", "International Economics and Trade", "Business Administration"]}, "Xian Jiaotong University": {"loc": "📍 Xi'an, Shaanxi", "qs": "QS Top 200", "tier": "Project 985", "logo": "https://logo.clearbit.com/xjtu.edu.cn", "levels": ["Bachelor", "Master", "PhD"], "streams": ["Engineering", "Medicine", "Business"], "duration": ["4 Years", "6 Years"], "scholarship": ["CSC Scholarship", "Freshman Scholarship (up to 100% Full Tuition)"], "programs": ["MBBS (6 Yrs)", "BDS (6 Yrs)", "Electrical Engineering and Automation", "Intelligent Manufacturing Engineering", "Energy and Power Engineering", "Materials Science and Engineering", "MBA"]}};

function openUniModal(name, meta) { try {
  var d = uniData[name] || {};
  var loc = d.loc || meta.loc || '📍 China';
  var qs  = d.qs  || meta.qs  || '';
  var tier= d.tier|| meta.tier|| '';

  // Logo
  var logoEl = document.getElementById('umLogo');
  if(d.logo){
    logoEl.innerHTML = '<img loading="lazy" src="'+d.logo+'" alt="'+name+'" onerror="this.parentNode.innerHTML=\''+name.split(' ').map(function(w){return w[0]}).join('').substring(0,3)+'\'">';
  } else {
    logoEl.textContent = name.split(' ').map(function(w){return w[0]}).join('').substring(0,3);
  }

  document.getElementById('umName').textContent = name;
  document.getElementById('umLoc').textContent  = loc;

  // Badges
  var badges = '';
  if(qs)   badges += '<span class="uni-modal-badge">'+qs+'</span>';
  if(tier) badges += '<span class="uni-modal-badge">'+tier+'</span>';
  document.getElementById('umBadges').innerHTML = badges;

  // Pills helper
  function pills(ids, items, cls){
    document.getElementById(ids).innerHTML = (items||[]).map(function(i){
      return '<span class="uni-modal-pill '+cls+'">'+i+'</span>';
    }).join('') || '<span class="uni-modal-pill gray">—</span>';
  }

  pills('umPrograms',  d.programs,   'navy');
  pills('umLevels',    d.levels,     'blue');
  pills('umStreams',   d.streams,    'gray');
  pills('umDuration',  d.duration,   'gold');
  pills('umScholarship',d.scholarship,'green');

  document.getElementById('uniModal').classList.add('open');
  document.body.style.overflow='hidden';
  } catch(e){ console.error("openUniModal error:",e); }
}

function closeUniModal(e){
  if(e && e.target !== document.getElementById('uniModal')) return;
  document.getElementById('uniModal').classList.remove('open');
  document.body.style.overflow='';
}

// Attach click to every uni-row
document.addEventListener('DOMContentLoaded', function(){
  initUniRowListeners();
  // Set correct university count on page load
  var total = document.querySelectorAll('#uniGrid .uni-row, #uniListWrap .uni-row').length;
  var countEl = document.getElementById('uniCountNum');
  if(countEl) countEl.textContent = total;
  document.querySelectorAll('.uni-row').forEach(function(row){
    row.addEventListener('click', function(e){
      if(e.target.tagName==='BUTTON') return; // don't open modal on Apply click
      var name = row.dataset.name || '';
      var meta = {
        loc:  row.querySelector('.uni-row-meta') ? row.querySelector('.uni-row-meta').textContent : '',
        qs:   row.querySelector('.uni-row-qs')   ? row.querySelector('.uni-row-qs').textContent   : '',
        tier: ''
      };
      openUniModal(name, meta);
    });
  });
});

// Google Apps Script Web App URL — receives Partner With Us submissions into a Google Sheet
const PARTNER_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxxbnvAjgnIvK_qLFZkuwT5pD2PCygqGcZe40PE1Nsf8KL_VA9Xh-JY6lk8aCAlTPs0zw/exec";

document.addEventListener('DOMContentLoaded', function(){
  let form = document.getElementById('partnerFullForm');
  if(!form) return;
  let btn = document.getElementById('partnerFullBtn');
  let msg = document.getElementById('partnerFullMsg');
  let iframe = document.getElementById('partner_hidden_iframe');
  let btnLabel = btn.textContent;
  let submitting = false;

  // Point the form straight at the Apps Script URL, targeting the hidden iframe.
  // This is a real browser form POST, not fetch/XHR — it is not subject to
  // the CORS response-reading restrictions that block fetch() with Apps Script.
  form.setAttribute('action', PARTNER_SCRIPT_URL);
  form.setAttribute('method', 'POST');
  form.setAttribute('target', 'partner_hidden_iframe');

  // Fires once the hidden iframe finishes loading the script's response.
  iframe.addEventListener('load', function(){
    if(!submitting) return; // ignore the iframe's initial blank load
    submitting = false;
    btn.disabled = false;
    btn.textContent = btnLabel;
    msg.style.display = 'block';
    msg.style.background = 'rgba(5,150,105,.1)';
    msg.style.color = '#047857';
    msg.style.border = '1px solid rgba(5,150,105,.25)';
    msg.textContent = "Thank you! Your application has been submitted. Our partnership team will reach out within 48 business hours.";
    form.reset();
  });

  form.addEventListener('submit', function(){
    // Let the browser submit normally to the hidden iframe — do NOT preventDefault.
    submitting = true;
    btn.disabled = true;
    btn.textContent = 'Submitting...';
    msg.style.display = 'none';
  });
});