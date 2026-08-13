package com.bitel.medepartment

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.input.VisualTransformation
import androidx.compose.ui.unit.dp

private const val FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScsXzAX_GehgkmcrPBkfL2rIPFZ7CS9AuPd3J8mSwseKPSIPQ/viewform?usp=header"
private const val API_URL = "PEGAR_URL_APPS_SCRIPT_AQUI"
class MainActivity : ComponentActivity() { override fun onCreate(s:Bundle?) { super.onCreate(s); setContent { MaterialTheme { DcApp { startActivity(Intent(Intent.ACTION_VIEW,Uri.parse(FORM_URL))) } } } } }
data class Session(val username:String,val role:String,val meName:String="")
data class Site(val site:String,val connection:String,val me:String,val completed:Boolean,val status:String)
@Composable fun DcApp(openForm:()->Unit) { var session by remember { mutableStateOf<Session?>(null) }; if(session==null) Login {u,p-> session=if(u=="admin"&&p=="clave-temporal") Session(u,"ADMIN") else Session(u,"TECNICO") } else Home(session!!,openForm){session=null} }
@Composable fun Login(login:(String,String)->Unit) { var u by remember{mutableStateOf("")};var p by remember{mutableStateOf("")};var v by remember{mutableStateOf(false)}; Column(Modifier.fillMaxSize().padding(28.dp),verticalArrangement=Arrangement.Center){Text("M&E Department",style=MaterialTheme.typography.headlineMedium);Text("Plan de Monitoreo DC");Spacer(Modifier.height(28.dp));OutlinedTextField(u,{u=it},label={Text("Usuario")},modifier=Modifier.fillMaxWidth());OutlinedTextField(p,{p=it},label={Text("Contraseña")},visualTransformation=if(v)VisualTransformation.None else PasswordVisualTransformation(),trailingIcon={TextButton({v=!v}){Text(if(v)"Ocultar" else "Ver")}},modifier=Modifier.fillMaxWidth());Spacer(Modifier.height(20.dp));Button({login(u,p)},Modifier.fillMaxWidth()){Text("Ingresar")}} }
@Composable fun Home(s:Session,openForm:()->Unit,logout:()->Unit){var page by remember{mutableStateOf("inicio")};Scaffold(topBar={TopAppBar(title={Text("Monitoreo DC")},actions={TextButton(logout){Text("Salir")}})}){pad->Column(Modifier.padding(pad).padding(16.dp)){if(page=="inicio"){Text("Usuario: ${s.username}");Text("Rol: ${s.role}");Spacer(Modifier.height(20.dp));Button({page="dc"},Modifier.fillMaxWidth()){Text("MONITOREO DC")}}else when(s.role){"ADMIN"->AdminMenu{page="inicio"};"ME"->MeMenu(s.meName){page="inicio"};else->Technician(openForm){page="inicio"}}}}}
@Composable fun Technician(open:()->Unit,back:()->Unit){Column{Text("Lista de Sites",style=MaterialTheme.typography.titleLarge);Button(open,Modifier.fillMaxWidth()){Text("Llenar formulario Monitoreo DC")};SearchSites();OutlinedButton(back,Modifier.fillMaxWidth()){Text("Volver")}}}
@Composable fun MeMenu(name:String,back:()->Unit){Column{Text("Personal M&E: $name",style=MaterialTheme.typography.titleLarge);Text("Mis Sites asignados");SearchSites(true);Text("Historial por personal");SearchSites();OutlinedButton(back,Modifier.fillMaxWidth()){Text("Volver")}}}
@Composable fun AdminMenu(back:()->Unit){Column{Text("Administración",style=MaterialTheme.typography.titleLarge);Text("Personal, consulta global y usuarios.");SearchSites();OutlinedButton(back,Modifier.fillMaxWidth()){Text("Volver")}}}
@Composable fun SearchSites(editable:Boolean=false){var q by remember{mutableStateOf("")};val list=listOf(Site("AMA0002","BBU","Diego",false,"PENDIENTE"));OutlinedTextField(q,{q=it},label={Text("Buscar Site")},modifier=Modifier.fillMaxWidth());LazyColumn(Modifier.heightIn(max=240.dp)){items(list.filter{it.site.contains(q,true)}){x->Card(Modifier.fillMaxWidth().padding(vertical=5.dp)){Row(Modifier.padding(12.dp)){Column(Modifier.weight(1f)){Text(x.site);Text("${x.connection} · ${x.me}");Text(x.status)};if(editable)Checkbox(x.completed,{})}}}}}
