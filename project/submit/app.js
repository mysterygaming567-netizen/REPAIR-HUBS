const demoShops=[{id:1,name:'CircuitFix Electronics'},{id:2,name:'TechCare Repair Hub'},{id:3,name:'Flamate Solutions'}];
document.addEventListener('DOMContentLoaded',()=>{
	const selectedShopId=localStorage.getItem('prefillShop');
	if(selectedShopId){const shop=demoShops.find(item=>item.id==selectedShopId);if(shop)document.querySelector('#device').value=`${shop.name} — new request`;localStorage.removeItem('prefillShop')}
	const user=JSON.parse(localStorage.getItem('user')||'null');
	if(user?.name)document.querySelector('#profileName').textContent=user.name.slice(0,2);
	document.querySelector('#logoutLink').addEventListener('click',event=>{event.preventDefault();localStorage.removeItem('user');location.href='../index/index.html'});
	document.querySelector('#media').addEventListener('change',event=>{const files=[...event.target.files];document.querySelector('#upload').firstChild.textContent=files.length?`${files.length} file${files.length>1?'s':''} selected`:'Add photos, videos, or a PDF of the issue'});
	document.querySelector('#submitForm').addEventListener('submit',event=>{
		event.preventDefault();
		const device=document.querySelector('#device').value.trim();const description=document.querySelector('#description').value.trim();if(!device||!description)return;
		const user=JSON.parse(localStorage.getItem('user')||'null');const files=[...document.querySelector('#media').files];const readFile=file=>new Promise(resolve=>{const reader=new FileReader();reader.onload=()=>resolve({name:file.name,type:file.type,size:file.size,data:reader.result});reader.onerror=()=>resolve({name:file.name,type:file.type,size:file.size});reader.readAsDataURL(file)});
		Promise.all(files.map(readFile)).then(media=>{const repairs=JSON.parse(localStorage.getItem('repairs')||'[]');const shopId=Number(selectedShopId)||1;const repair={id:Date.now(),ticket:`RH-${Math.floor(Math.random()*9000)+1000}`,device,description,customer:user?.name||'Customer',customerEmail:user?.email||'',deadline:document.querySelector('#deadline').value,status:0,shopId,created:new Date().toISOString(),estCompletion:new Date(Date.now()+3*24*3600*1000).toISOString(),warrantyDays:60,messages:[],media};repairs.unshift(repair);try{localStorage.setItem('repairs',JSON.stringify(repairs))}catch(error){repair.media=media.map(file=>({name:file.name,type:file.type,size:file.size}));localStorage.setItem('repairs',JSON.stringify(repairs))}document.querySelector('#submitResult').textContent='Request submitted — your technician will review it shortly.';setTimeout(()=>location.href='../myrepairs/myrepairs.html',650)});
	});
});
