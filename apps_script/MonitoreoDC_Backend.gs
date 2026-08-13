const DC_CONFIG = {
  spreadsheetId: '1T8GU7SoRMWN9CRQR0ED-oac4F7yKcRN_1qwAqa4UYSQ',
  responsesSheet: 'Respuestas de formulario 1',
  usersSheet: 'USUARIOS_APP',
  staffSheet: 'PERSONAL_ME'
};

function doGet(e) {
  const action = (e.parameter.action || 'health').toLowerCase();
  try {
    if (action === 'health') return json_({ok:true, message:'Monitoreo DC API activa'});
    if (action === 'login') return json_(login_(e.parameter.user, e.parameter.password));
    if (action === 'sites') return json_(sites_(e.parameter));
    if (action === 'staff') return json_(staff_());
    if (action === 'users') return json_(users_());
    return json_({ok:false, error:'Acción no válida'});
  } catch (err) { return json_({ok:false, error:String(err)}); }
}

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    if (data.action === 'updateCompletion') return json_(updateCompletion_(data));
    if (data.action === 'saveStaff') return json_(saveStaff_(data));
    if (data.action === 'deleteStaff') return json_(deleteStaff_(data));
    if (data.action === 'saveUser') return json_(saveUser_(data));
    return json_({ok:false, error:'Acción no válida'});
  } catch (err) { return json_({ok:false, error:String(err)}); }
}

function installMonitoreoDC() {
  const ss = SpreadsheetApp.openById(DC_CONFIG.spreadsheetId);
  let users = ss.getSheetByName(DC_CONFIG.usersSheet);
  if (!users) users = ss.insertSheet(DC_CONFIG.usersSheet);
  if (users.getLastRow() === 0) users.appendRow(['Usuario','Contraseña','Rol','Nombre M&E','Activo']);
  let staff = ss.getSheetByName(DC_CONFIG.staffSheet);
  if (!staff) staff = ss.insertSheet(DC_CONFIG.staffSheet);
  if (staff.getLastRow() === 0) staff.appendRow(['Check','Personal asignado','CULMINADO','PENDIENTE']);
}

function login_(user, password) {
  const rows = table_(DC_CONFIG.usersSheet);
  const item = rows.find(r => String(r['Usuario']).trim() === String(user).trim() && String(r['Contraseña']) === String(password) && String(r['Activo']).toUpperCase() !== 'NO');
  return item ? {ok:true, user:{username:item['Usuario'], role:item['Rol'], meName:item['Nombre M&E'] || ''}} : {ok:false, error:'Usuario o contraseña incorrectos'};
}
function sites_(p) {
  const all = table_(DC_CONFIG.responsesSheet);
  const search = String(p.search || '').toLowerCase();
  const person = String(p.person || '').toLowerCase();
  const filtered = all.filter(r => {
    const site = String(r['Nombre de Site'] || '').toLowerCase();
    const me = String(r['Nombre de personal M&E'] || '').toLowerCase();
    return (!search || site.includes(search)) && (!person || me === person);
  }).map((r, i) => ({row:i + 2, timestamp:r['Marca temporal'] || '', site:r['Nombre de Site'] || '', connection:r['Tipo de conexion'] || r['Tipo de conexión'] || '', technician:r['Escribe tu nombre'] || '', phone:r['Escribe tu numero de celular'] || r['Escribe tu número de celular'] || '', me:r['Nombre de personal M&E'] || '', mePhone:r['Numero de Celular'] || r['Número de Celular'] || '', completed:truth_(r['Trabajo culminado']), status:r['Estado'] || (truth_(r['Trabajo culminado']) ? 'CULMINADO' : 'PENDIENTE')}));
  return {ok:true, sites:filtered};
}
function staff_() { return {ok:true, staff:table_(DC_CONFIG.staffSheet).map((r,i)=>({row:i+2, checked:truth_(r['Check']), name:r['Personal asignado'] || '', completed:Number(r['CULMINADO'] || 0), pending:Number(r['PENDIENTE'] || 0)}))}; }
function users_() { return {ok:true, users:table_(DC_CONFIG.usersSheet).map((r,i)=>({row:i+2, username:r['Usuario']||'', password:r['Contraseña']||'', role:r['Rol']||'', meName:r['Nombre M&E']||'', active:r['Activo']||'SI'}))}; }
function updateCompletion_(d) { const sh=sheet_(DC_CONFIG.responsesSheet); sh.getRange(Number(d.row), headerIndex_(sh,'Trabajo culminado')).setValue(!!d.completed); sh.getRange(Number(d.row), headerIndex_(sh,'Estado')).setValue(d.completed?'CULMINADO':'PENDIENTE'); return {ok:true}; }
function saveStaff_(d) { const sh=sheet_(DC_CONFIG.staffSheet); const row=Number(d.row)||sh.getLastRow()+1; sh.getRange(row,1,1,4).setValues([[!!d.checked,d.name||'',Number(d.completed||0),Number(d.pending||0)]]); return {ok:true,row:row}; }
function deleteStaff_(d) { sheet_(DC_CONFIG.staffSheet).deleteRow(Number(d.row)); return {ok:true}; }
function saveUser_(d) { const sh=sheet_(DC_CONFIG.usersSheet); const row=Number(d.row)||sh.getLastRow()+1; sh.getRange(row,1,1,5).setValues([[d.username,d.password,d.role,d.meName||'',d.active||'SI']]); return {ok:true,row:row}; }
function table_(name) { const sh=sheet_(name), data=sh.getDataRange().getValues(); const h=data.shift().map(String); return data.filter(r=>r.some(v=>v!== '')).map(r=>Object.fromEntries(h.map((x,i)=>[x,r[i]]))); }
function sheet_(name) { const sh=SpreadsheetApp.openById(DC_CONFIG.spreadsheetId).getSheetByName(name); if(!sh) throw new Error('No se encontró la hoja: '+name); return sh; }
function headerIndex_(sh,name) { const i=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String).indexOf(name); if(i<0) throw new Error('No se encontró la columna: '+name); return i+1; }
function truth_(v) { return v === true || String(v).toUpperCase() === 'TRUE' || String(v).toUpperCase() === 'SI'; }
function json_(obj) { return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON); }
