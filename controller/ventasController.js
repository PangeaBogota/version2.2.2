/**
 * Created by dev10 on 1/7/2016.
 */
var app_angular = angular.module('PedidosOnline');


//CONTROLADOR DEL MOULO DE VENTAS
app_angular.controller("pedidoController",['Conexion','$scope','$location','$http','$routeParams','$timeout',function (Conexion,$scope,$location,$http,$routeParams,$timeout) {
	setTimeout(function() {
		$('#AlertaSin').click();
	}, 1000);
	var meses = new Array ("Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre");
    var diasSemana = new Array("Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado");		
	$scope.openmodalBalance=false;
	$scope.fechaSincronizacion=window.localStorage.getItem("FECHA_SINCRONIZACION");
	$scope.ColorMasivo=[];
	$scope.ColorMasivoAnterior=[];
	$scope.tallasAnteriores=[];
	$scope.itemDisabled=false;
	$scope.colorDisabled=false;
	$scope.validaciones;
	$scope.CantidadTotalPedido=0;
	$scope.ejemplovista=[];
	$scope.Variables;
	$scope.tallas=[];
	$scope.empaques=[];
	$scope.recordempaque;
	$scope.TABLA_BALANCE=JSON.parse(window.localStorage.getItem("TABLA_BALANCE"));
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.validacion=0;
	$scope.item;
	$scope.listaPrecios=[];
	$scope.pedidoDetalles=[];
	$scope.date;
	$scope.dateEntrega;
	$scope.precioItem;
	$scope.itemPrecio;
	$scope.itemsAgregadosPedido=[];
	$scope.terceroSelected=[];
	$scope.Search;
	$scope.sucursal=[];
	$scope.pedidos=[];
	$scope.list_tercero = [];
	$scope.list_Sucursales=[];
	$scope.list_precios=[];
	$scope.listprecios=[];
	$scope.list_puntoEnvio=[];
	$scope.list_items=[];
	$scope.SearchItem;
	$scope.ultimoRegistroseleccionado=[];
	$scope.ultimoRegistro=[];
	$scope.pedido_detalle=[];
	$scope.list_pedidos_detalles=[];
	$scope.valorTotal;
	$scope.ModalColorOpen=false;
	$scope.ModalColorMasivo=false;
	$scope.sucursalDespacho=[];
	$scope.ciudadSucursal=[];
	$scope.puntoEnvio=[];
	$scope.hasfocus;
	$scope.cantidadBase;
	$scope.dataFiltro;
	$scope.SearchItem;
	$scope.filter=[];
	$scope.bandera=[];
	$scope.cantidadrefererencia=0;
	$scope.bandera.banderaEditar=false;
	$scope.criterio=[];
	$scope.bandera.itemEdit=[];
	$scope.bandera.banderaEditarDelete=0;
	$scope.empaque=[];
	$scope.cantidadprueba=0;
	$scope.cantidades=0;
	$scope.itemextension2Detalle=[];
	$scope.cantidadParcialItem=0;
	$scope.tallaInidiceColor=[];
	$scope.onChangeCantidad=function(talla,stock)
	{
		$scope.cantidadrefererencia=0;
		for (var i = 0;i<$scope.tallas.length;i++) {
			if ($scope.tallas[i].talla==talla) {

				if ($scope.item.item_custom1!="SI") {
					$scope.validacionStock=$scope.tallas[i].cantidad*12;
					//$scope.cantidadrefererencia=$scope.tallas[i].cantidad;
					//if ($scope.validacionStock>stock) {
					//	$scope.tallas[i].cantidad=0;
					//	Mensajes("La Cantidad no puede ser mayor al stock","error","");
					//}
					$scope.cantidadrefererencia+=$scope.tallas[i].cantidad;
				}else{
					$scope.validacionStock=$scope.tallas[i].cantidad;
					//if ($scope.validacionStock>stock) {
					//	$scope.tallas[i].cantidad=0;
					//	Mensajes("La Cantidad no puede ser mayor al stock","error","");
					//}
					$scope.cantidadrefererencia+=$scope.tallas[i].cantidad;
				}
				$scope.tallas[i].estadoextension2=2;
			}
		}
		$scope.calcularTotalCantidad();
	}
	$scope.calcularTotalCantidad=function()
	{
		$scope.cantidadrefererencia=0;
		
		for (var i = 0;i<$scope.tallas.length;i++) {
			$scope.cantidadrefererencia+=$scope.tallas[i].cantidad;
		}
	}
	$scope.eliminarColores=function(){
		for (var i =0;i< $scope.tallas.length;i++) {
			if ($scope.tallaInidiceColor.cont1==i) {
				$scope.tallas[i].detalle2=[];
				$scope.tallas[i].estadoextension2=0;
			}
		}
	}
	$scope.calcularDireferenciaTallasCalor=function()
	{
		var cantidad=0;
		for (var a=0;a<$scope.tallas.length;a++) {
			for (var i = 0;i<$scope.tallas[a].detalle2.length;i++) {
			cantidad+=$scope.tallas[a].detalle2[i].cantidad;
			}
			var cantidadtalla=($scope.tallas[a].cantidad*12);
			if (cantidadtalla==0) {
				$scope.tallas[a].estadoextension2=3;		
				return;
			}
			if (cantidadtalla==cantidad) {
				$scope.tallas[a].estadoextension2=1;		
			}
			else
			{
				$scope.tallas[a].estadoextension2=2;		
			}
			cantidad=0;
		}	
	}
	$scope.calcularDireferenciaTallaColor=function(indice)
	{
		var cantidad=0;
		for (var i = 0;i<$scope.tallas[indice].detalle2.length;i++) {
			cantidad+=$scope.tallas[indice].detalle2[i].cantidad;
		}
		var cantidadtalla=($scope.tallas[indice].cantidad*12);
		if (cantidadtalla==0) {
			$scope.tallas[indice].estadoextension2=3;		
			return;
		}
		if (cantidadtalla==cantidad) {
			$scope.tallas[indice].estadoextension2=1;		
		}
		else
		{
			$scope.tallas[indice].estadoextension2=2;		
		}
	}
	$scope.cantidadTalla=function(talla,accion,stock)
	{
		if (accion=="restar") {
			for (var i = 0;i<$scope.tallas.length;i++) {

				if ($scope.tallas[i].talla==talla) {
					if ($scope.tallas[i].cantidad==0) {
						$scope.tallas[i].detalle2=[];
						$scope.AgregarColoresMasivoTalla(talla);
						return
					}
					
					//if ($scope.tallas[i].detalle2.length>0) {
						//Mensajes('No puedes disminuir la cantidad con Colores Asignados','error','')
					//	$('#confirmacioncolores').click();
					//	$scope.tallaInidiceColor.cont1=[];
					//	$scope.tallaInidiceColor.cont1=i;
					//	return
					//}
					if ($scope.item.item_custom1!="SI") {
						$scope.tallas[i].cantidad-=0.5;	
						$scope.tallas[i].multiplo--;
					}else{
						$scope.tallas[i].cantidad-=1;	

						$scope.tallas[i].multiplo--;
					}
					$scope.cantidadrefererencia+=$scope.tallas[i].cantidad;
					if ($scope.tallas[i].cantidad==0) {
						$scope.tallas[i].estadoextension2=3;
					}else
					{
						$scope.calcularDireferenciaTallaColor(i);
						//$scope.tallas[i].estadoextension2=2;	
					}
					if ($scope.tallas[i].cantidad>0) {
						
						$scope.AgregarColoresMasivoTalla(talla);
					}
				}
			
			}
				
		}
		else
		{
			for (var i = 0;i<$scope.tallas.length;i++) {
				if ($scope.tallas[i].talla==talla) {

					if ($scope.item.item_custom1!="SI") {
						$scope.tallas[i].cantidad+=0.5;	
						$scope.tallas[i].multiplo++;
						$scope.Validarstock=$scope.tallas[i].cantidad*12;
						debugger
						if ($scope.tallas[i].cantidad%1==0) {
							
						}
						//if ($scope.Validarstock>stock) {
						//	$scope.tallas[i].cantidad-=0.5;	
						//	$scope.tallas[i].multiplo--;
						//	Mensajes("La Cantidad no puede ser mayor al stock","error","");
						//}
					}else{
						$scope.tallas[i].cantidad+=1;	
						$scope.tallas[i].multiplo++;
						$scope.Validarstock=$scope.tallas[i].cantidad;

						//if ($scope.Validarstock>stock) {
						//	$scope.tallas[i].cantidad-=1;	
						//	$scope.tallas[i].multiplo--;
						//	Mensajes("La Cantidad no puede ser mayor al stock","error","");
						//}
					}
					$scope.AgregarColoresMasivoTalla(talla);
					$scope.calcularDireferenciaTallaColor(i);
					//$scope.tallas[i].estadoextension2=2;
					
				}
				$scope.cantidadrefererencia+=$scope.tallas[i].cantidad;
				
			}
		}
		$scope.calcularTotalCantidad();
	}
	//var query1="select item.item_referencia||'-'||item.item_descripcion as producto,item.id_unidad,item.rowid as rowid_item,item.item_descripcion as descripcion,precios.rowid as rowid_listaprecios,precios.precio_lista as precio";
	//var query=query1+" from erp_items item inner join erp_items_precios precios on  item.rowid=precios.rowid_item ";
	//CRUD.select(query,function(elem){$scope.list_items.push(elem);});
	$scope.terceroDeTercero=$routeParams.personId;
	$scope.pedidoEditar=0;
	$scope.pedidoEditarEncabezado=[];
	$scope.pedidoEditarMovimiento=[];
	
	if ($scope.terceroDeTercero!=undefined) {
		if ($scope.terceroDeTercero.includes('p')) {
		$scope.pedidoEditar=1;

		$scope.terceroDeTercero=$scope.terceroDeTercero.replace('p','');
		CRUD.select("select pe.*,su.rowid_tercero as tercero,maestro.erp_id_maestro from t_pedidos pe inner join erp_terceros_sucursales su on pe.rowid_cliente_facturacion=su.rowid inner join erp_entidades_master  maestro  on pe.rowid_lista_precios=maestro.rowid where pe.rowid='"+$scope.terceroDeTercero+"'",function(elem){
			$scope.pedidoEditarEncabezado=elem;
			$scope.pedidos.orden_compra=elem.orden_compra;
			$scope.fechaentrega(elem.fecha_entrega);
			CRUD.select("select  * from t_pedidos_detalle where rowid_pedido='"+elem.rowid+"'",function(detallePedido){
				
				detallePedido.detalle2=[];
				$scope.pedidoEditarMovimiento.push(detallePedido);
			});
			CRUD.select("select*from erp_terceros order by razonsocial",function(tercero){
				$scope.list_tercero.push(tercero);
				if (tercero.rowid==elem.tercero) {
					$scope.terceroSelected=tercero;
					CRUD.select("select  codigo_sucursal||'-'||nombre_sucursal as sucursal,*from erp_terceros_sucursales where rowid_tercero='"+tercero.rowid+"'",function(sucursal){
						$scope.list_Sucursales.push(sucursal)
						if ($scope.pedidoEditarEncabezado.rowid_cliente_facturacion==sucursal.rowid) {
							$scope.sucursal=sucursal;
							$scope.onChangeSucursal('edit');
						}
					})
				}
			})
		})
		
	}
	}
	$scope.Empaque=function(){
		$scope.empaques=[];
		CRUD.select("select*from m_metaclass where  class_code='PEDIDO.EMPAQUE'",
		function(elem)
		{	
			if ($scope.empaques.length==5) {

			}else{
			$scope.empaques.push(elem)
			//if (elem.tipo_reg_nombre=='SUELTO') {
			//	$scope.empaque=elem
			//}	
			}

			
		});	
	}
	$scope.Empaque();
	if ($scope.pedidoEditar==0) {
		CRUD.select('select*from erp_terceros order by razonsocial',
		function(elem)
		{
			$scope.list_tercero.push(elem);

			if ($scope.terceroDeTercero!=undefined   && elem.rowid==$scope.terceroDeTercero  && $scope.pedidoEditar==0) 
			{
				$scope.terceroSelected=elem
				//$scope.Search=$scope.terceroSelected.razonsocial;
				$scope.onChangeTercero();
				
			}
		});	
	}
	
	
	$scope.stringConsultaItems=function(parm1){
		debugger
		var count='';
		var vista='';
		if (parm1.pC==1) {
			if ($scope.filter.codigoitem!=''  && $scope.filter.codigoitem!=undefined   &&  ( $scope.filter.descripcionitem==''   || $scope.filter.descripcionitem==undefined)){//  && $scope.filter.descripcionitem=='' || $scope.filter.descripcionitem==undefined ) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid ";
				count="select count(*) as cantidad from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid ";
			}
			else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && ( $scope.filter.codigoitem=='' || $scope.filter.codigoitem==undefined   )) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+" and  (tipo_inventario = '"+parm1.p1+"')  and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )   order by rowid ";
				count="select count(*) from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and   (tipo_inventario = '"+parm1.p1+"')  and    (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )   order by rowid ";
			}
			else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && $scope.filter.codigoitem!='' && $scope.filter.codigoitem!=undefined   ) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and (tipo_inventario = '"+parm1.p1+"')  and    (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )    order by rowid ";
				count="select count(*) as cantidadfrom vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and (tipo_inventario = '"+parm1.p1+"') and    (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )    order by rowid ";
			}
			else {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+" and (tipo_inventario = '"+parm1.p1+"')  order by rowid ";
				count="select 100 as cantidad ";
			}
		}
		else if (parm1.pC==2) {
			if ($scope.filter.codigoitem!=''  && $scope.filter.codigoitem!=undefined   &&  ( $scope.filter.descripcionitem==''   || $scope.filter.descripcionitem==undefined)){//  && $scope.filter.descripcionitem=='' || $scope.filter.descripcionitem==undefined ) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid  ";
				count="select count(*) as cantidad from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    item_codigo1 like '%"+$scope.filter.codigoitem+"%'  order by rowid ";
			}
			else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && ( $scope.filter.codigoitem=='' || $scope.filter.codigoitem==undefined   )) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )  and    (tipo_inventario = '"+parm1.p1+"'  or  tipo_inventario = '"+parm1.p2+"')  order by rowid ";
				count="select count(*) from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )  and    (tipo_inventario = '"+parm1.p1+"'  or  tipo_inventario = '"+parm1.p2+"')  order by rowid ";
			}
			else if ($scope.filter.descripcionitem!='' && $scope.filter.descripcionitem!=undefined && $scope.filter.codigoitem!='' && $scope.filter.codigoitem!=undefined   ) {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )  and    (tipo_inventario = '"+parm1.p1+"'  or  tipo_inventario = '"+parm1.p2+"')   order by rowid ";
				count="select count(*) as cantidadfrom vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and  item_codigo1 like '%"+$scope.filter.codigoitem+"%' and   (   item_referencia1 like '%"+$scope.filter.descripcionitem+"%'   or descripcion like '%"+$scope.filter.descripcionitem+"%' )  and    (tipo_inventario = '"+parm1.p1+"'  or  tipo_inventario = '"+parm1.p2+"')   order by rowid ";
			}
			else {
				vista="select*from vw_items_precios  where  rowid="+$scope.pedidos.rowid_lista_precios+"  and    (tipo_inventario = '"+parm1.p1+"'  or  tipo_inventario = '"+parm1.p2+"')   order by rowid ";
				count="select 100 as cantidad ";
			}
		}

		return vista;
	}
	$scope.onChangeListaPrecios=function(){
	
		if ($scope.pedidos.rowid_lista_precios==undefined) {$scope.list_items=[];return}
		$scope.list_items=[];
		
		$scope.filtroCO=[];
		if ($scope.sucursal.centro_operacion=='001') {
			$scope.filtroCO.p1='IN300501';
			$scope.filtroCO.pC=1;
		}
		else if ($scope.sucursal.centro_operacion=='003') 
		{
			$scope.filtroCO.p1='IN300502';
		
			$scope.filtroCO.p2='IN300503';
			$scope.filtroCO.pC=2;
		}
		$scope.result=$scope.stringConsultaItems($scope.filtroCO);
		
		CRUD.select($scope.result,function(elem){$scope.list_items.push(elem);if ($scope.bandera.banderaEditar==true) {$scope.item=$scope.list_items[0]}});
		
	}
	$scope.onChangeFiltro=function()
	{
		if ($scope.SearchItem=='') {$scope.item=[]}
	}
	$scope.onGetFiltro=function()
	{
		$scope.onChangeListaPrecios();		
	}
	$scope.CurrentDate=function(){
		$scope.day;
		$scope.DayNow=Date.now();
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
		return $scope.day;
	}
	$scope.SelectedDate=function(daySelected){
		$scope.day;
		$scope.DayNow=new Date(daySelected);
		$scope.YearS=$scope.DayNow.getFullYear();
		$scope.MonthS=$scope.DayNow.getMonth()+1;
		if ($scope.MonthS<10) {$scope.MonthS='0'+$scope.MonthS}
		$scope.DayS=$scope.DayNow.getDate();
		$scope.HourS=$scope.DayNow.getHours();
		$scope.MinuteS=$scope.DayNow.getMinutes();
		if ($scope.DayS<10) {$scope.DayS='0'+$scope.DayS}
		$scope.day=$scope.YearS+'-'+$scope.MonthS+'-'+$scope.DayS;
		return $scope.day;
	}


	$scope.guardarTermporal=function(){
		$scope.validacionInsert('temporal');
	}
	$scope.fechasolicitud=function(){
		$scope.pedidos.fecha_solicitud=$scope.SelectedDate($scope.date);
		$scope.datenow=new Date();
		$scope.pedidos.fechacreacion=$scope.CurrentDate();
		$scope.pedidos.fecha_pedido=$scope.CurrentDate();
		var FechaCreacion=$scope.pedidos.fechacreacion.replace('-','');
		var FechaSolicitud=$scope.pedidos.fecha_solicitud.replace('-','');
		FechaCreacion=FechaCreacion.replace('-','');
		 FechaSolicitud=FechaSolicitud.replace('-','');
	}
	$scope.fechachange=0;
	$scope.fechaentrega=function(fechaEdit){
		debugger
		if ($scope.pedidoEditar==1 && $scope.fechachange==0 && fechaEdit!=undefined) {
			var fechanueva=new Date(fechaEdit);
			fechanueva.setDate(fechanueva.getDate() + 1);
			document.getElementById("fecha_entrega").valueAsDate = fechanueva
			$scope.dateEntrega=	document.getElementById("fecha_entrega").valueAsDate;
			$scope.fechachange=1;
		}

		var hoy = new Date($scope.dateEntrega);
		if ($scope.fechaDefault>hoy) {
			Mensajes('Dias minimos de entrega son 3 Dias','error','');
			$scope.pedidos.fecha_entrega='';
			document.getElementById("fecha_entrega").valueAsDate = null;
			return;
		}
		//hoy.setTime(hoy.getTime()+24*60*60*1000);
		var i=hoy.getDay()
		var d = new Date(hoy),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

	    if (month.length < 2) month = '0' + month;
	    if (day.length < 2) day = '0' + day;

    	var diaSeleccionado= [year, month, day].join('-');
		/*if (i==0) {
			Mensajes('No se puede seleccionar un dia festivo','error','');
			$scope.pedidos.fecha_entrega='';
			document.getElementById("fecha_entrega").valueAsDate = null;
			return;
		}*/
		for (var i =0;i<DiasFestivos.length;i++) {
			if (diaSeleccionado==DiasFestivos[i]) {
				Mensajes('No se puede seleccionar un dia festivo','error','');
				$scope.pedidos.fecha_entrega='';
				document.getElementById("fecha_entrega").valueAsDate = null;
				return;
			}
		}

		$scope.pedidos.fecha_solicitud=$scope.CurrentDate();
		$scope.pedidos.fechacreacion=$scope.CurrentDate();
		$scope.pedidos.fecha_entrega=$scope.SelectedDate($scope.dateEntrega);
		$scope.pedidos.fecha_pedido=$scope.CurrentDate();
		var FechaCreacion=$scope.pedidos.fechacreacion.replace('-','');
		var FechaEntrega=$scope.pedidos.fecha_entrega.replace('-','');
		 FechaCreacion=FechaCreacion.replace('-','');
		 FechaEntrega=FechaEntrega.replace('-','');
		if (FechaEntrega<FechaCreacion) {
			Mensajes('Fecha Entrega No puede ser Menor que La Fecha creacion del pedido','error','');
			$scope.pedidos.fecha_entrega='';
			document.getElementById("fecha_entrega").valueAsDate = null;
			return;
		}
	}
	$scope.onChangeComboItem=function(){
		$scope.itemDisabled=false;
		$scope.Restante=12;
		$scope.tallas=[];
		$scope.MediaDocenaCount=6;
		$scope.ColorMasivoMedia=[];
		$scope.ColorMasivo=[];

		CRUD.select("select distinct  e.itemID,item.item_referencia,e.extencionDetalle1ID as talla,0 as cantidad,0  as multiplo,ext1_d.erp_descripcion_corta,sum(e.stock) as stock from erp_items_extenciones  e inner join erp_items item on item.rowid=e.itemID inner join  erp_item_extencion1_detalle ext1_d on ext1_d.rowid_erp=e.extencionDetalle1ID where e.itemID='"+$scope.item.rowid_item+"'  group by e.itemID,item.item_referencia,e.extencionDetalle1ID,ext1_d.erp_descripcion_corta order by ext1_d.erp_descripcion_corta ",function(elem){
			//estado 0 inicia sin colores
			elem.estadoextension2=3;

			elem.detalle2=[];
			$scope.validaciones=true;
			if ($scope.bandera.banderaEditar==true) {
				angular.forEach($scope.bandera.itemEdit.tallas,function(value,key){
					if (value.talla==elem.talla) {
						elem.cantidad=value.cantidad;
						elem.detalle2=value.detalle2
						if (value.detalle2.length>0) {
							elem.estadoextension2=1;	
						}
						
					}
				})
			}
			
			$scope.tallas.push(elem);
			$scope.calcularTotalCantidad();
			
		})
		setTimeout(function() {
			$scope.itemDisabled=false;
		}, 1000);
	}
	$scope.cantidadRestanteDetalle2=function(cantidad){
		$scope.contadorCantidades=0;
		$scope.contadorDetalle2=0;
		for (var i = 0;i<$scope.itemextension2Detalle.length;i++) {
			$scope.contadorCantidades+=$scope.itemextension2Detalle[i].cantidad;
			$scope.contadorDetalle2+=$scope.itemextension2Detalle[i].cantidad;
		}

		$scope.cantidadRestante=cantidad-$scope.contadorDetalle2;
	}
	$scope.cantidadRestante=0;
	$scope.onChangeCantidadDetalle2=function(extension,stock,cantidad){

		$scope.cantidadRestante=0;
		$scope.contadorDetalle2=0;
		if ($scope.item.item_custom1!="SI") {
			cantidad=cantidad*12;
		}
		for (var i =0;i<$scope.itemextension2Detalle.length;i++) {
			$scope.cantidadRestante+=$scope.itemextension2Detalle[i].cantidad;
			$scope.contadorDetalle2+=$scope.itemextension2Detalle[i].cantidad;
		}
		$scope.cantidadRestante=cantidad-$scope.cantidadRestante;
		for (var i = 0;i<$scope.itemextension2Detalle.length;i++) {
			if ($scope.itemextension2Detalle[i].extencionDetalle2ID==extension) {
				
				if ($scope.item.item_custom1!="SI") {
					
					$scope.validacionStock=$scope.itemextension2Detalle[i].cantidad;
					if ($scope.validacionStock>stock && $scope.itemextension2Detalle[i].estadoID==4003) {
						$scope.itemextension2Detalle[i].cantidad=0;
						$scope.contadorDetalle2=$scope.contadorDetalle2-$scope.itemextension2Detalle[i].cantidad;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
					if ($scope.contadorDetalle2>cantidad) {
						$scope.itemextension2Detalle[i].cantidad=0;
						$scope.contadorDetalle2=$scope.contadorDetalle2-$scope.itemextension2Detalle[i].cantidad;
						Mensajes("La Cantidad no sobrepasar la Cantidad Inicial","error","");
					}
				}else{
					$scope.validacionStock=$scope.itemextension2Detalle[i].cantidad;
					if ($scope.validacionStock>stock && $scope.itemextension2Detalle[i].estadoID==4003) {
						$scope.itemextension2Detalle[i].cantidad=0;
						$scope.contadorDetalle2=$scope.contadorDetalle2-$scope.itemextension2Detalle[i].cantidad;
						Mensajes("La Cantidad no puede ser mayor al stock","error","");
					}
					if ($scope.validacionStock>cantidad) {
						$scope.itemextension2Detalle[i].cantidad=0;
						$scope.contadorDetalle2=$scope.contadorDetalle2-$scope.itemextension2Detalle[i].cantidad;
						Mensajes("La Cantidad no sobrepasar la Cantidad Inicial","error","");
					}
				}
					
			}
		}
		$scope.contadorDetalle2=0;
		for (var i =0;i<$scope.itemextension2Detalle.length;i++) {
			$scope.contadorDetalle2+=$scope.itemextension2Detalle[i].cantidad;
		}
		$scope.cantidadRestanteDetalle2(cantidad);
	}
	$scope.InfoItemAdicional=[];
	$scope.consultaDetalle2=function(item,talla,cantidad){
		item=item.trim();
		$scope.InfoItemAdicional=[];
		if ($scope.item.item_custom1!='SI') {
			$scope.InfoItemAdicional.cantidad=cantidad*12;	
		}
		$scope.cantidadParcialItem=$scope.InfoItemAdicional.cantidad
		$scope.InfoItemAdicional.talla=talla;
		$scope.itemextension2Detalle=[];
		$scope.contadorDetalle2=0;
		$scope.banderaConsumo=1;
		for (var i =0;i<$scope.tallas.length;i++) {

			if ($scope.tallas[i].talla==talla) {
				if ($scope.tallas[i].detalle2.length!=0) {
					for (var f=0;f<$scope.tallas[i].detalle2.length;f++) {
						$scope.tallas[i].detalle2[f].cantidadextension1=cantidad;	
					}
					$scope.itemextension2Detalle=$scope.tallas[i].detalle2;
					$scope.banderaConsumo=0;
				}
			}
		}

		if ($scope.banderaConsumo==1) {
			//$(".colores-add").attr("disabled","disabled");
			CRUD.select("select a.*,0 as cantidad,'"+cantidad+"' as cantidadextension1,d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID where itemID='"+item+"'  and  extencionDetalle1ID='"+talla+"'  order by a.extencionDetalle2ID ",function(elem){
				$scope.itemextension2Detalle.push(elem);
				//$(".colores-add").removeAttr("disabled");
			})	
		}

		
		$scope.cantidadRestanteDetalle2($scope.InfoItemAdicional.cantidad);
		
	}
	$scope.contadorDetalle2=0;
	$scope.agregarColoresTalla=function(){
		for (var i = 0;i<$scope.tallas.length;i++) {
			if ($scope.tallas[i].talla==$scope.InfoItemAdicional.talla) {
				$scope.tallas[i].detalle2=$scope.itemextension2Detalle;

				if ($scope.contadorDetalle2==$scope.cantidadParcialItem) {
					//si se le agregaron todos los colores a la talla
					$scope.tallas[i].estadoextension2=1;
				}else if ($scope.contadorDetalle2>0) {
					$scope.tallas[i].estadoextension2=2;
				}
				else
				{
					$scope.tallas[i].estadoextension2=0;
				}

			}
		}
		$scope.ModalColorOpen=false;
		$scope.calcularDireferenciaTallasCalor();
	}
	$scope.adicionarCantidadDetalle2=function(extension,accion,stock,cantidad){
		
		if ($scope.item.item_custom1!="SI") {
			cantidad=cantidad*12;
		}
		
		if (accion=="restar") {
			for (var i = 0;i<$scope.itemextension2Detalle.length;i++) {

				if ($scope.itemextension2Detalle[i].extencionDetalle2ID==extension) {
					if ($scope.itemextension2Detalle[i].cantidad==0) {
						return
					}
					if ($scope.item.item_custom1!="SI") {
						$scope.itemextension2Detalle[i].cantidad-=1;
						$scope.contadorDetalle2--;	
					}else{
						$scope.itemextension2Detalle[i].cantidad-=1;
						$scope.contadorDetalle2--;		
					}
					
				}
			}
				
		}
		else
		{

			if ($scope.contadorDetalle2==cantidad) {
				Mensajes('Cantidad Maxima Alcanzada','error','');
				return
			}
			for (var i = 0;i<$scope.itemextension2Detalle.length;i++) {
				if ($scope.itemextension2Detalle[i].extencionDetalle2ID==extension) {
					if ($scope.item.item_custom1!="SI") {
						$scope.itemextension2Detalle[i].cantidad+=1;	
						$scope.Validarstock=$scope.itemextension2Detalle[i].cantidad;
						$scope.contadorDetalle2++;	
						if ($scope.Validarstock>stock && $scope.itemextension2Detalle[i].estadoID==4003) {
							$scope.itemextension2Detalle[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
						if ($scope.itemextension2Detalle[i].cantidad>cantidad) {
							$scope.itemextension2Detalle[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede sobrepasar la Cantidad Seleccionada","error","");
						}
					}else{
						$scope.itemextension2Detalle[i].cantidad+=1;	
						$scope.contadorDetalle2++;	
						$scope.Validarstock=$scope.itemextension2Detalle[i].cantidad;

						if ($scope.Validarstock>stock && $scope.itemextension2Detalle[i].estadoID==4003) {
							$scope.itemextension2Detalle[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede ser mayor al stock","error","");
						}
						if ($scope.itemextension2Detalle[i].cantidad>cantidad) {
							$scope.itemextension2Detalle[i].cantidad-=1;	
							$scope.contadorDetalle2--;	
							Mensajes("La Cantidad no puede sobrepasar la Cantidad Seleccionada","error","");
						}
					}
					
				}
			}
		}
		$scope.cantidadRestanteDetalle2(cantidad);
	}

	$scope.openModalDetalle2=function(item,talla,cantidad){
		
		
		$scope.colorDisabled=true
		if (cantidad==undefined) {
			Mensajes('Agregar Cantidad','error','');
			return
		}
		if (cantidad==0) {
			Mensajes('Agregar Cantidad','error','');
			return
		}

		$scope.consultaDetalle2(item,talla,cantidad);
		
		$scope.ModalColorOpen=true;
		$('#extension2').click();

		
	}
	$scope.onChangePuntoEnvio=function()
	{
		$scope.sucursalDespacho=$scope.puntoEnvio;
		$scope.pedidos.id_punto_envio=$scope.puntoEnvio.rowid
	}
	$scope.onChangeTercero=function(){
		$scope.list_Sucursales=[];
		$scope.list_puntoEnvio=[];
		$scope.tallas=[];
		$scope.sucursalDespacho=[];
		$scope.ciudad='';
		$scope.CantidadTotalPedido=0;
		$scope.itemsAgregadosPedido=[];
		$scope.ciudadSucursal=[];
		$scope.list_items=[];
		$scope.filter=[];
		$scope.list_precios=[];
		CRUD.select("select  codigo_sucursal||'-'||nombre_sucursal as sucursal,*from erp_terceros_sucursales where rowid_tercero = '"+$scope.terceroSelected.rowid+"'   order by codigo_sucursal",function(elem){$scope.list_Sucursales.push(elem)})

		//CRUD.selectParametro('erp_terceros_sucursales','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_Sucursales.push(elem)});
		//CRUD.selectParametro('erp_terceros_punto_envio','rowid_tercero',$scope.terceroSelected.rowid,function(elem){$scope.list_puntoEnvio.push(elem)});	''
		//$scope.pedidos.rowid_tercero=$scope.terceroSelected.rowid
	}
	CRUD.select("select count(*) as cantidad from erp_entidades_master ",function(elem){console.log(elem.cantidad)})
	$scope.contadoritemEditados=0;
	$scope.onChangeSucursal=function(parm){
		
		if ($scope.sucursal==undefined) {$scope.pedidos.rowid_lista_precios='';$scope.list_items=[];return}
		$scope.list_precios=[];
		var consultacriterio="select*from erp_entidades_master where id_tipo_maestro='CRITERIO_CLASIFICACION' and erp_id_maestro='"+$scope.sucursal.id_criterio_clasificacion.trim()+"'"
		CRUD.select(consultacriterio,function(elem){
			$scope.criterio=elem;
		})
		CRUD.select("select count(*) as dataValidacion,erp_id_maestro||'-'||erp_descripcion as concatenado ,*from erp_entidades_master where erp_id_maestro = '"+$scope.sucursal.id_lista_precios+"'  and id_tipo_maestro='LISTA_PRECIOS' order by rowid LIMIT 1",
			
			function(elem){
				
				if (elem.dataValidacion==0) {
					
					CRUD.select("select erp_id_maestro||'-'||erp_descripcion as concatenado , * from erp_entidades_master where erp_id_maestro = '001' and id_tipo_maestro='LISTA_PRECIOS'",function(elem){
						
						$scope.list_precios.push(elem);$scope.listaPrecios=$scope.list_precios[0];$scope.pedidos.rowid_lista_precios=$scope.listaPrecios.rowid;//$scope.onChangeListaPrecios();
					})
				}
				else
				{
					$scope.list_precios.push(elem);$scope.listaPrecios=$scope.list_precios[0];$scope.pedidos.rowid_lista_precios=$scope.listaPrecios.rowid;
					$scope.onChangeListaPrecios();		
					if (parm=='edit') {
						$scope.onAddItemsEdit();
					}

				}
			});
		//CRUD.selectParametro('erp_entidades_master','erp_id_maestro',$scope.sucursal.id_lista_precios,function(elem){$scope.list_precios.push(elem)});
		$scope.pedidos.rowid_cliente_facturacion=$scope.sucursal.rowid;
		$scope.sucursalDespacho=$scope.sucursal;
		//$scope.sucursalDespacho=$scope.sucursal;
		$scope.onChangeSucursalDespacho();
	}
	$scope.onAddItemsEdit=function(){
		
		$scope.detallesPedidoEdit=[];
		$scope.items=[];
		$scope.contadores=[];
		$scope.contadores.cont1=0;
		CRUD.select("select distinct dt.rowid_item,dt.linea_descripcion,dt.rowid_pedido,item.item_referencia,dt.empaque from t_pedidos_detalle dt inner join erp_items item on item.rowid=dt.rowid_item  where dt.rowid_pedido='"+$scope.pedidoEditarEncabezado.rowid+"'",function(detalle){
			
			detalle.tallas=[];
			$scope.detallesPedidoEdit.push(detalle);
			CRUD.select("select*from vw_items_precios  where  rowid="+$scope.pedidoEditarEncabezado.rowid_lista_precios+" and rowid_item='"+detalle.rowid_item+"'",function(items){
				items.empaque='';
				items.empaqueshow='';
				items.tallas=[];
				$scope.items.unshift(items)
			})
			CRUD.select("select count(*) as c,'"+detalle.rowid_item+"' as rowid_item from t_pedidos_detalle where rowid_pedido='"+$scope.pedidoEditarEncabezado.rowid+"'  and  rowid_item='"+detalle.rowid_item+"'",function(detalle1){
				
				CRUD.select("select  '"+detalle1.c+"' as contador ,dt.*,item.item_referencia from t_pedidos_detalle dt inner join erp_items item on item.rowid=dt.rowid_item  where rowid_pedido='"+$scope.pedidoEditarEncabezado.rowid+"'  and  rowid_item='"+detalle1.rowid_item+"'",function(tallas){
					
					$scope.contadores.cont1++;
					for (var i =0;i<$scope.items.length;i++) {
						if (tallas.rowid_item==$scope.items[i].rowid_item) {
							$scope.talla=[];
							
							$scope.talla.cantidad=tallas.cantidad/12;
							$scope.talla.talla=tallas.item_ext1;
							$scope.talla.detalle2=[];
							$scope.talla.estadoextension2=1;
							$scope.talla.item_referencia=tallas.item_referencia;
							$scope.talla.erp_descripcion_corta=tallas.rowid_item_ext;
							$scope.items[i].tallas.push($scope.talla);
							$scope.items[i].empaque=tallas.empaque;
							$scope.items[i].empaqueshow=tallas.empaque;

						}
					}
					if ($scope.contadores.cont1==tallas.contador) {
						
						for (var i =0;i<$scope.items.length;i++) {
							if (tallas.rowid_item==$scope.items[i].rowid_item) {

								$scope.item=$scope.items[i];

								$scope.tallas=$scope.items[i].tallas;
								$scope.adicionaritem('edit');
							}
						}
						$scope.contadores.cont1=0;
					}
				})
			})
		})

		$timeout(function () {
			 //agregar array de colores a tallas
			CRUD.select("select tpdd.*,tpd.rowid_item,tpd.item_ext1,tpd.cantidad as cantidadextension1,i.item_custom1,tpd.rowid_item from t_pedidos_detalle_detalle tpdd inner join t_pedidos_detalle tpd on tpd.rowid=tpdd.pedidoDetalle inner join t_pedidos tp on tp.rowid=tpd.rowid_pedido left join erp_items i on tpd.rowid_item=i.rowid   where tp.rowid='"+$scope.terceroDeTercero+"' ",function(elem){
				if (elem.item_custom1!='SI') {
					elem.cantidadextension1=elem.cantidadextension1/12;
				}
				CRUD.select("select*,"+elem.cantidad+" as cantidad,'"+elem.cantidadextension1+"' as cantidadextension1 from erp_items_extenciones where itemID='"+elem.rowid_item+"'  and  extencionDetalle1ID='"+elem.item_ext1+"' ",function(colors){
					
					for (var i = 0;i<$scope.itemsAgregadosPedido.length;i++ ) {
						if (colors.itemID==$scope.itemsAgregadosPedido[i].rowid_item) {
							for (var f=0;f<$scope.itemsAgregadosPedido[i].tallas.length;f++) {
								if (colors.extencionDetalle1ID==$scope.itemsAgregadosPedido[i].tallas[f].talla) {
									$scope.itemextension2Detalle.push(colors);
								}
							}
						}
					}
				})	
				
			})   
			}, 3000);

	}
	$scope.confimar=[];
	$scope.confimar.next=[]
	$scope.confimar.current=[]
	$scope.confimar.salir=false
	$scope.onConfirmarSalida=function(accion){
		if (accion=='salir') {
			var a='';
			if ($scope.confimar.next.params.modulo==undefined) {
				a='/';
			}
			else{
				a='/'+$scope.confimar.next.params.modulo+'/'+$scope.confimar.next.params.url;
			}

			$timeout(function () {
				$location.path(a)
			}, 100);
			
		}else if (accion=='permanecer') {
			$scope.confimar.salir=false;
			
		}
		else if (accion=='guardar') {
			$scope.confimar.salir=false;
			$scope.validacionInsert()
		}
	}
	$scope.$on('$routeChangeStart', function(event,next, current) { 
		debugger
		if ($scope.openmodalBalance==true) {
			$scope.openmodalBalance=false;
			event.preventDefault();
			$('#modalBalanceColores').click();

			return;
		}
		if ($scope.ModalColorMasivo==true) {
			$scope.ModalColorMasivo=false
			$scope.AgregarColoresMasivo();
			$('#ModalMasivo').click();
			$scope.AgregarColoresMasivoM();
			event.preventDefault();
			$('#ModalMasivoMedia').click();
			return;
		}
		if ($scope.ModalColorOpen==true) 
		{
			$scope.agregarColoresTalla();
			$scope.ModalColorOpen=false;
			event.preventDefault();
			$('#CerrarModalColores').click();
			return;
		}

		if ($scope.confimar.salir==false) {
			$scope.confimar.next=next;
			  $scope.confimar.current=current
			  $scope.confimar.salir=true;
			  event.preventDefault();
			  $('#confirmacion').click();
		}
		
		  
	 });
	$scope.onChangeSucursalDespacho=function()
	{
		//console.log("select  *from erp_terceros_punto_envio where rowid_tercero = '"+$scope.terceroSelected.rowid+"'  and  codigo_sucursal = '"+$scope.sucursalDespacho.codigo_sucursal+"'   order by rowid  LIMIT 1  ");
		$scope.pedidos.rowid_cliente_despacho=$scope.sucursalDespacho.rowid;
		//CRUD.select("select pais.nombre||'-'||ciudad.nombre as nombre from m_localizacion  pais inner join m_localizacion ciudad  on ciudad.id_pais=pais.id_pais and pais.id_depto='' and pais.id_ciudad=''  where ciudad.id_ciudad='"+$scope.sucursalDespacho.id_ciudad+"' and ciudad.id_depto='"+$scope.sucursalDespacho.id_depto+"' and ciudad.id_pais='"+$scope.sucursalDespacho.id_pais+"'",
		//	function(elem){$scope.ciudadSucursal=elem});
		
		CRUD.select("select direccion ||'-'|| nombre_punto_envio as concatenado, *from erp_terceros_punto_envio where rowid_tercero = '"+$scope.terceroSelected.rowid+"'  and  codigo_sucursal = '"+$scope.sucursalDespacho.codigo_sucursal+"'   order by direccion ",
			function(elem){$scope.list_puntoEnvio.push(elem);
				//$scope.pedidos.id_punto_envio=elem.rowid;$scope.puntoEnvio=elem
				if ($scope.pedidoEditar==1) {
					if (elem.rowid==$scope.pedidoEditarEncabezado.id_punto_envio) {
						$scope.puntoEnvio=elem;
					}
				}
			});
	}

	$scope.finalizarPedido=function(destino){

		if($scope.itemsAgregadosPedido.length==0)
		{
			Mensajes('Debe Seleccionar al menos un item de la lista','error','');
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		ProcesadoShow();
		$scope.guardarCabezera(destino);
		window.setTimeout(function(){
			$scope.guardarDetalle(destino);
		},1700)
		
		window.setTimeout(function(){
			
			Mensajes('Pedido Guardado Correctamente','success','');
			$scope.confimar.salir=true
			ProcesadoHiden();
			window.location.href = '#/ventas/pedidos_ingresados';

		},14000)
		
	}
	$scope.onChangeFiltroTercero=function(){
		if ($scope.Search=='') {$scope.terceroSelected=[];}
	}
	$scope.adicionaritem=function(parm){
		if (parm!='edit') {
			if($scope.item==null)
			{
				Mensajes('Seleccione un item de la lista','error','');
				return
			}
			if($scope.item==null)
			{
				Mensajes('Seleccione un item de la lista','error','');
				return
			}
			if($scope.item.length==0)
			{
				Mensajes('Seleccione un item de la lista','error','');
				return
			}
			if($scope.empaque.length==0)
			{
				Mensajes('Seleccione el empaque','error','');
				return
			}
		}
		$scope.banderacoloresincompletos=false;
		for (var i =0;i< $scope.tallas.length ;i++) {
			if ($scope.tallas[i].cantidad==0) {
				$scope.tallas[i].detalle2=[];
			}
			if ($scope.tallas[i].cantidad>0 && $scope.tallas[i].estadoextension2!=1) {
				$scope.banderacoloresincompletos=true;
			}
		}
		if ($scope.banderacoloresincompletos) {
			Mensajes('Asignar todos los colores a las tallas.','error','');
			return
		}
		$scope.validarExistencia=false;
		
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			if ($scope.item.rowid_item==value.rowid_item) {
				if ($scope.bandera.banderaEditar==true) {
					$scope.delete($scope.bandera.banderaEditarDelete)
				}
				else
				{
					$scope.validarExistencia=true;
				}
			}
		})
		if($scope.validarExistencia)
		{
			Mensajes('Item ya existe en el pedido','error','');
			return
		}
		$scope.multiplo=0;
		$scope.validacionCantidades=0;
		$scope.item.iva=$scope.item.precio*$scope.item.impuesto_porcentaje/100;
		$scope.item.valorTotal=0;
		$scope.tallasAgregar=[];
		$scope.item.cantidad=0;
		$scope.validacionprimerofiltro=false;
		$scope.validacionCantidadesmutiplo=false;
		$scope.longitudarray=$scope.tallas.length;
		for (var i=1;i<9;i++) {
			
			$scope.banderaSimilar=true;
			for (var f=0;f<$scope.tallas.length;f++) {
				$scope.i=parseInt($scope.tallas[f].erp_descripcion_corta);
				if ($scope.i==i) {
					$scope.var1=0;
					if ($scope.item.item_custom1!="SI") {
						$scope.var1=$scope.tallas[f].cantidad*12;
					}else{
						$scope.var1=$scope.tallas[f].cantidad;	
					}
					
					$scope.tallas[f].cantidad1=parseInt($scope.var1);
					$scope.multiplo=$scope.tallas[f].multiplo;
					$scope.item.cantidad+=$scope.tallas[f].cantidad1;
					$scope.validacionCantidades++;
					$scope.tallasAgregar.push($scope.tallas[f]);
					$scope.banderaSimilar=false;
				}
			}
			if ($scope.banderaSimilar) {
					$scope.tallas1=[];
					$scope.tallas1.itemID="0";
					$scope.tallas1.item_referencia1="0";
					$scope.tallas1.talla="0";
					$scope.tallas1.cantidad="0";
					$scope.tallas1.cantidad1=0;
					$scope.tallas1.multiplo="0";
					$scope.tallas1.erp_descripcion_corta="0";
					$scope.tallasAgregar.push($scope.tallas1);
				}
		}

			
		if ($scope.item.cantidad<1) {
			Mensajes('Tallas sin Cantidades','error','');
		return
		}
		$scope.item.multiplo=$scope.multiplo;
		$scope.item.tallas=$scope.tallasAgregar;
		if ($scope.Variables==undefined) {
			$scope.item.observaciones='';	
		}else{
			$scope.item.observaciones=$scope.Variables.descripcion;	
		}
		if (parm!='edit') {
			$scope.item.empaque=$scope.empaque.tipo_reg_nombre;
			$scope.item.empaqueshow=$scope.empaque.tipo_reg_nombre.slice(0,3);	
		}
		else{
			$scope.item.empaqueshow=$scope.item.empaqueshow.slice(0,3);	
		}
		
		$scope.itemsAgregadosPedido.unshift($scope.item);
		Mensajes('Item Agregado','success','');
		$scope.CantidadTotalPedido=0;
		for (var i = 0;i<$scope.itemsAgregadosPedido.length;i++) {
			$scope.CantidadTotalPedido+=$scope.itemsAgregadosPedido[i].cantidad;
		}
		$scope.Restante=12
		$scope.ColorMasivo=[];
		$scope.MediaDocenaCount=6;
		$scope.ColorMasivoMedia=[];
		$scope.item=[];
		$scope.SearchItem='';
		$scope.cantidadBase='';
		$scope.CalcularCantidadValorTotal();
		$scope.filter=[];
		$scope.empaque=[];
		$scope.tallas=[];
		//$scope.list_items=[];
		$scope.Variables=undefined;
		$scope.tallasAgregar=[];
		$scope.validaciones=false;
		$scope.bandera.banderaEditar=false;
		$scope.cantidadrefererencia=0;
		$scope.Empaque();
		$('#rowid_item').focus();

	}
	//$scope.Sincronizar=function()
	//{
//		debugger
//		$('#sincronizarID').click();
//	}

	$scope.CalcularCantidadValorTotal=function(){
		$scope.valortotal=0;
		$scope.iva=0;
		$scope.cantidad=0;
		$scope.ivatotal=0;
		$scope.precioEstandar=0;
		$scope.precioEstandar1=0;
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.precioEstandar1+=value.precio*value.cantidad;
			$scope.precioEstandar=value.precio*value.cantidad;
			$scope.valortotal+=$scope.precioEstandar;
			$scope.cantidad+=value.cantidad;
			$scope.ivatotal+=value.iva*value.cantidad;
		})
		$scope.pedidoDetalles.neto=$scope.precioEstandar1;
		$scope.pedidoDetalles.iva=$scope.ivatotal;
		$scope.pedidoDetalles.cantidad=$scope.cantidad;
		$scope.pedidoDetalles.total=$scope.valortotal+$scope.ivatotal;
		localStorage.removeItem('valores'); 
		localStorage.setItem('valores',JSON.stringify($scope.pedidoDetalles));
	}
	$scope.editItem=function(item,index){
		$scope.filter.descripcionitem=item.item_referencia1;
		//$scope.onChangeListaPrecios();
		$scope.bandera.banderaEditar=true;
		$scope.bandera.banderaEditarDelete=index;
		$scope.bandera.itemEdit=item;
		$scope.empaque.tipo_reg_nombre=item.empaque;
		$scope.empaques=[];
		CRUD.select("select*from m_metaclass where  class_code='PEDIDO.EMPAQUE'",
		function(elem)
		{
			$scope.empaques.push(elem)
			if (elem.tipo_reg_nombre==item.empaque) {
				$scope.empaque=elem;
			}
			
		});
		$scope.item=item;
		$scope.Variables=[];
		$scope.Variables.descripcion=item.observaciones;
		$scope.onChangeComboItem();
		$scope.actualizarPrecio();

		$scope.CambiarTab('3','atras');
	}
	$scope.delete = function (index) {
		console.log(index)
		$scope.itemsAgregadosPedido.splice(index, 1);
		$scope.CalcularCantidadValorTotal();
		$scope.CalcularCantidadTotal();
	}
	$scope.CalcularCantidadTotal=function(){
		
		$scope.CantidadTotalPedido=0;
		angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			$scope.CantidadTotalPedido+=value.cantidad;
		})
	};

	$scope.guardarDetalle=function(destino){
		$scope.tablaEncabezadoDestino='';
		$scope.tablaMovimientoDestino='';
		if (destino=='temporal') {
			$scope.tablaEncabezadoDestino='t_pedidos_temporal';
			$scope.tablaMovimientoDestino='t_pedidos_detalle_temporal';
		}else{
			$scope.tablaEncabezadoDestino='t_pedidos';
			$scope.tablaMovimientoDestino='t_pedidos_detalle';
		}
		CRUD.select('select max(rowid) as rowid from t_pedidos',function(elem){
			$scope.pedidos.rowid=elem.rowid;
			angular.forEach($scope.itemsAgregadosPedido,function(value,key){
			angular.forEach(value.tallas,function(detalle,key){
				$scope.detalle=[];
				if (detalle.cantidad==0) {
					return
				}
				detalle.cantidad=detalle.cantidad1;
				$scope.detalle.rowid_item=value.rowid_item;
				$scope.detalle.rowid_pedido=$scope.pedidos.rowid;
				$scope.detalle.linea_descripcion=value.descripcion;
				$scope.detalle.id_unidad=value.id_unidad;
				$scope.detalle.cantidad=detalle.cantidad;
				$scope.detalle.factor=0;
				$scope.detalle.cantidad_base=detalle.cantidad;
				$scope.detalle.stock=0;
				$scope.detalle.porcen_descuento=value.impuesto_porcentaje;
				$scope.calculo=[];
				$scope.calculo.valor_base=value.precio*detalle.cantidad;
				$scope.calculo.iva=$scope.calculo.valor_base*value.impuesto_porcentaje/100;
				$scope.detalle.valor_impuesto=$scope.calculo.iva
				$scope.calculo.total=$scope.calculo.valor_base+$scope.calculo.iva;
				$scope.detalle.valor_descuento=0;
				$scope.detalle.rowid_item_ext=parseInt(detalle.erp_descripcion_corta);
				$scope.detalle.valor_total_linea=$scope.calculo.total;
				$scope.detalle.precio_unitario=value.precio;
				$scope.detalle.valor_base=value.precio*detalle.cantidad;
				$scope.detalle.usuariocreacion=$scope.sessiondate.nombre_usuario;
				$scope.detalle.empaque=value.empaque;
				$scope.detalle.item_ext1=detalle.talla;
				$scope.detalle.estado=0;
				$scope.detalle.indicador=$scope.sessiondate.key;
				$scope.detalle.observaciones=value.observaciones;
				$scope.detalle.fechacreacion=$scope.CurrentDate();
				CRUD.insert($scope.tablaMovimientoDestino,$scope.detalle);
				CRUD.select("select max(rowid) as rowid from t_pedidos_detalle",function(Detalle){
					var NewQuery=true
					var stringSentencia="";
					var contador=0;
					for (var i = 0;i<detalle.detalle2.length;i++) {
						contador++;
						if (detalle.detalle2[i].cantidad>0) {
							if (NewQuery) {
							stringSentencia=" insert into t_pedidos_detalle_detalle  ";
								NewQuery=false;
							}
							else{
								stringSentencia+= "   UNION   ";
							}
							stringSentencia+=  "  SELECT  "+
							//ped[i].e_rowid+
							"null,'"+parseInt(Detalle.rowid)+
							"','"+detalle.detalle2[i].extencionDetalle2ID+"','"+detalle.detalle2[i].cantidad+"',0,0,0,0,0,0 "; 
						}
						if (contador==499) {
							CRUD.Updatedynamic(stringSentencia)
							NewQuery=true;
							stringSentencia="";
							contador=0;
						}
					}	
					if (stringSentencia!="") {
						CRUD.Updatedynamic(stringSentencia)
						NewQuery=true;
						stringSentencia="";
						contador=0;
					}
				})
			})
		})
		})
		var a=0;
		CRUD.select('SELECT  SUM (valor_base)  as total,SUM (cantidad)  as cantidad FROM  t_pedidos_detalle  where rowid_pedido='+$scope.pedidos.rowid+'',function(elem){$scope.pedidoDetalles.push(elem)});
	}
	$scope.actualizarPrecio=function(){
		$scope.CalcularCantidadValorTotal();
	}
	$scope.guardarCabezera=function(destino){
		if ($scope.pedidoEditar==1) {
			CRUD.Delete('t_pedidos',$scope.terceroDeTercero);
			CRUD.DeleteDetalle('t_pedidos_detalle',$scope.terceroDeTercero);
		}
		$scope.tablaDestino='';
		if (destino=='temporal') {
			$scope.tablaDestino='t_pedidos_temporal';
		}else{
			$scope.tablaDestino='t_pedidos';
		}
		//$scope.pedido_detalle.rowid_pedido=$scope.pedidos.rowid;
		$scope.pedidos.modulo_creacion='MOBILE';
		$scope.pedidos.valor_total=$scope.pedidoDetalles.total;
		$scope.pedidos.valor_base=$scope.pedidoDetalles.neto;
		$scope.pedidos.usuariocreacion=$scope.sessiondate.nombre_usuario;
		$scope.pedidos.rowid_empresa=4;
		$scope.pedidos.id_cia=1;
		$scope.pedidos.fecha_solicitud=$scope.pedidos.fecha_pedido;
		$scope.pedidos.valor_impuesto=$scope.pedidoDetalles.iva;
		$scope.pedidos.valor_descuento=0;
		$scope.pedidos.id_estado=101;
		$scope.pedidos.ind_estado_erp=0;
		$scope.pedidos.valor_facturado=0;
		$scope.pedidos.id_punto_envio=$scope.puntoEnvio.rowid
		$scope.pedidos.sincronizado='false';
		$scope.pedidos.estado_sincronizacion=0;
		$scope.pedidos.key_user=$scope.sessiondate.key;
		$scope.pedidos.ambiente=$scope.sessiondate.codigo_empresa;
		CRUD.insert($scope.tablaDestino,$scope.pedidos)
	}
	$scope.validacionInsert=function(accion)
	{
		$('#btnGuardar').attr('disabled','disabled');
		if ($scope.pedidos.rowid_cliente_facturacion =='' || $scope.pedidos.rowid_cliente_facturacion==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if ($scope.puntoEnvio.rowid==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if ($scope.pedidos.rowid_cliente_despacho =='' || $scope.pedidos.rowid_cliente_despacho==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if ($scope.pedidos.rowid_lista_precios =='' || $scope.pedidos.rowid_lista_precios==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if ($scope.pedidos.fecha_solicitud =='' || $scope.pedidos.fecha_solicitud==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if ($scope.pedidos.fecha_entrega =='' || $scope.pedidos.fecha_entrega==undefined) {
			Mensajes("Verifique Que Todos lo campos esten Llenos","error","")
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if($scope.itemsAgregadosPedido.length==0)
		{
			Mensajes('Debe Seleccionar al menos un item de la lista','error','');
			$('#btnGuardar').removeAttr('disabled');
			return
		}
		if (accion=='temporal') {
			$scope.finalizarPedido('temporal')
		}else
		{
			$scope.finalizarPedido('normal')
		}
		
	}
	$scope.MediaDocenaCount=6;
	$scope.ColorMasivoMedia=[];
	$scope.TallasMediaDocena=function()
	{
		$scope.ModalColorMasivo=true;
		//$scope.ColorMasivoAnterior=[];
		//$scope.ColorMasivoAnterior=$scope.ColorMasivo.slice();
		
		$('#OpenModalColorMedia').click();
		if ($scope.ColorMasivoMedia.length==0) {
			CRUD.select("select distinct a.itemID,a.extencionDetalle2ID,0 as cantidad,d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where itemID='"+$scope.item.rowid_item+"' order by extencionDetalle2ID",function(elem){
				$scope.ColorMasivoMedia.push(elem);
				
			})		
		}
	}
	$scope.ValidacionCabezera=function()
	{
		$scope.CambiarTab('3','atras');
		$scope.hasfocus=true;
	}
	$scope.modulo=MODULO_PEDIDO_NUEVO;
	angular.element('ul.tabs li').click(function () {

		var tab_id = angular.element(this).find('a').data('tab');
		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');
		angular.element(this).toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	});
	$scope.CambiarTab = function (tab_actual, accion) {
		$scope.tab_id = null;
		if (tab_actual == '2' && accion == 'atras')
			$scope.tab_id = 'tab_1';
		else if (tab_actual == '2' && accion == 'siguiente')
			$scope.tab_id = 'tab_3';
		else if (tab_actual == '3' && accion == 'atras')
			$scope.tab_id = 'tab_2';

		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');

		angular.element("ul.tabs").find("[data-tab='" + $scope.tab_id + "']").toggleClass('active');
		angular.element("#" + $scope.tab_id).toggleClass('active');
	};
	angular.element('#ui-id-1').mouseover(function (){
		angular.element('#ui-id-1').show();
	});
	$scope.fechaDefault="";
	if ( $scope.terceroDeTercero==undefined || !$scope.terceroDeTercero.includes('p') ) {
		var hoy = new Date();
		var count=0;
		while (count<3) {
		  hoy.setTime(hoy.getTime()+24*60*60*1000); // añadimos 1 día
		  if ( hoy.getDay() != 0)
		  {
			//hoy.setDate(hoy.getDate() + 1);
			var d = new Date(hoy),
	        month = '' + (d.getMonth() + 1),
	        day = '' + d.getDate(),
	        year = d.getFullYear();

		    if (month.length < 2) month = '0' + month;
		    if (day.length < 2) day = '0' + day;

	    	var diaSeleccionado= [year, month, day].join('-');
		
			for (var  i= 0; i < DiasFestivos.length; i++) {
				if (diaSeleccionado==DiasFestivos[i]) {
					hoy.setDate(hoy.getDate() + 1);
				}
			}
		  	count++;  
		  }
		}
		$scope.fechaDefault=hoy;
		document.getElementById("fecha_entrega").valueAsDate = hoy;
		$scope.dateEntrega=	hoy;
		$scope.fechaentrega();
	}

	$scope.TallasGenerales=function()
	{
		$scope.ModalColorMasivo=true;
		$scope.ColorMasivoAnterior=[];
		$scope.ColorMasivoAnterior=$scope.ColorMasivo.slice();
		
		$('#OpenModalColor').click();
		if ($scope.ColorMasivo.length==0) {
			CRUD.select("select distinct a.itemID,a.extencionDetalle2ID,0 as cantidad,d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where itemID='"+$scope.item.rowid_item+"' order by extencionDetalle2ID",function(elem){
				$scope.ColorMasivo.push(elem);
				
			})		
		}	
	}
	$scope.CantidadTotal=12;
	$scope.Restante=12;
	$scope.adicionarCantidadColor=function(color,accion)
	{
		if ($scope.Restante==0 && accion=="SUMAR") {
			Mensajes('Cantidad Maxima Alcanzada','error','');
			return;
		}
		if (accion=="SUMAR") {
			for (var i =0;i<$scope.ColorMasivo.length;i++) {
				if ($scope.ColorMasivo[i].extencionDetalle2ID==color) {
					$scope.ColorMasivo[i].cantidad+=1;
					$scope.Restante--;
				}
			}	
		}else{
			for (var i =0;i<$scope.ColorMasivo.length;i++) {
				if ($scope.ColorMasivo[i].extencionDetalle2ID==color) {
					if ($scope.ColorMasivo[i].cantidad!=0) {
						$scope.ColorMasivo[i].cantidad-=1;
						$scope.Restante++;		
					}
					
				}
			}
		}
	}
	$scope.adicionarCantidadColorM=function(color,accion)
	{
		if ($scope.MediaDocenaCount==0 && accion=="SUMAR") {
			Mensajes('Cantidad Maxima Alcanzada','error','');
			return;
		}
		if (accion=="SUMAR") {
			for (var i =0;i<$scope.ColorMasivoMedia.length;i++) {
				if ($scope.ColorMasivoMedia[i].extencionDetalle2ID==color) {
					$scope.ColorMasivoMedia[i].cantidad+=1;
					$scope.MediaDocenaCount--;
				}
			}	
		}else{
			for (var i =0;i<$scope.ColorMasivoMedia.length;i++) {
				if ($scope.ColorMasivoMedia[i].extencionDetalle2ID==color) {
					if ($scope.ColorMasivoMedia[i].cantidad!=0) {
						$scope.ColorMasivoMedia[i].cantidad-=1;
						$scope.MediaDocenaCount++;		
					}
					
				}
			}
		}
	}
	$scope.ItemModal=[];
	$scope.ModalItem=function(item){
		$scope.openmodalBalance=true;
		$('#ColoresAgregados').click();
		$scope.ItemModal=[];
		$scope.ItemModal=item;
	}
	/*$scope.AgregarColoresMasivo=function()
	{
		
		ProcesadoShow();
		for (var i =0; i<$scope.tallas.length;i++ ) {

			var CantidadBase=$scope.tallas[i].cantidad;
			CRUD.selectAllinOne("select*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray from erp_items_extenciones where itemID='"+$scope.tallas[i].itemID+"'  and  extencionDetalle1ID='"+$scope.tallas[i].talla+"'  order by extencionDetalle2ID",function(elem){
				
				var CantidadTalla=0;
				var InidicadorArray=0;
				var ContadorColor=0;
				var CantidadAnterior=0;
				var ValidacionEstadoCompleto=true;

				if (elem.length>0) {
					InidicadorArray=elem[0].IndicadorArray;
					CantidadTalla=elem[0].cantidadextension1;	
				}
				if ($scope.ColorMasivoAnterior.length>0) {
					CantidadAnterior= $scope.tallasAnteriores[InidicadorArray].cantidad;
				}
				var Registro=[];
				if ($scope.tallas[InidicadorArray].detalle2.length>0) {
					Registro=$scope.tallas[InidicadorArray].detalle2;
				}else
				{
					Registro=elem;
				}
				//RESTAR CANTIDADES ANTERIORES
				for (var t =0;t< Registro.length;t++) {
					for (var x=0;x<$scope.ColorMasivoAnterior.length;x++) {
						if (Registro[t].extencionDetalle2ID==$scope.ColorMasivoAnterior[x].extencionDetalle2ID) {
							if (CantidadAnterior % 1 == 0) {
								Registro[t].cantidad-=$scope.ColorMasivoAnterior[x].cantidad*CantidadAnterior;
							}
							else
							{
								$scope.CantidadParcial=CantidadAnterior-0.5
								Registro[t].cantidad-=$scope.ColorMasivoAnterior[x].cantidad*$scope.CantidadParcial;
							}
						}	
					}
				}
				
				//AGREGAR COLORES NUEVOS
				for (var t =0;t< Registro.length;t++) {
					//InidicadorArray=elem[t].IndicadorArray;
					//CantidadTalla=elem[t].cantidadextension1;
					for (var x=0;x<$scope.ColorMasivo.length;x++) {
						if (Registro[t].extencionDetalle2ID==$scope.ColorMasivo[x].extencionDetalle2ID) {
							if (CantidadTalla % 1 == 0) {
								Registro[t].cantidad+=$scope.ColorMasivo[x].cantidad*CantidadTalla;
								ContadorColor+=Registro[t].cantidad;
							}
							else
							{
								ValidacionEstadoCompleto=false;
								var CantidadParcial=CantidadTalla-0.5
								Registro[t].cantidad+=$scope.ColorMasivo[x].cantidad*CantidadParcial;
								ContadorColor+=Registro[t].cantidad
							}
						}	
					}
				}
				debugger
				if (ContadorColor==(parseInt(CantidadTalla.toString())*12)) {
					$scope.tallas[InidicadorArray].estadoextension2=1;
				}
				else
				{
					$scope.tallas[InidicadorArray].estadoextension2=2;	
				}
				ContadorColor=0;
				if (CantidadTalla>0) {
					$scope.tallas[InidicadorArray].detalle2=Registro;
				}
			})			
		}	
		setTimeout(function() {
			ProcesadoHiden();
			$scope.tallasAnteriores=[];	
			$scope.tallasAnteriores=angular.copy($scope.tallas)	
		}, 2000);
		
		
		
	}*/
	$scope.cantidadColor=function(InidicadorArray)
	{
		var Cantidad=0;
		for (var i = 0; i < $scope.tallas[InidicadorArray].detalle2.length; i++) {
			Cantidad+=$scope.tallas[InidicadorArray].detalle2[i].cantidad;
		}
		return Cantidad;
	}
	$scope.AgregarColoresMasivoM=function()
	{
		$scope.ModalColorMasivo=false;
		if ($scope.ColorMasivoMedia.length==0) {
			return;
		}
		for (var i =0; i<$scope.tallas.length;i++ ) {
			var CantidadBase=$scope.tallas[i].cantidad;
			if (CantidadBase% 1 != 0) {
				var cantidadColores=$scope.cantidadColor(i);
				if (((CantidadBase*12)-cantidadColores)==6) {
					CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
						var CantidadTalla=0;
						var InidicadorArray=0;
						var ContadorColor=0;
						var ValidacionEstadoCompleto=true;
						if (elem.length>0) {
							InidicadorArray=elem[0].IndicadorArray;
							CantidadTalla=elem[0].cantidadextension1;	
							if ($scope.tallas[InidicadorArray].detalle2.length>0) {
								for (var t =0;t< $scope.tallas[InidicadorArray].detalle2.length;t++) {
									for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
										if ($scope.tallas[InidicadorArray].detalle2[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
											
											$scope.tallas[InidicadorArray].detalle2[t].cantidad+=$scope.ColorMasivoMedia[x].cantidad;
											if (elem[t].estadoID==4003 && (($scope.tallas[InidicadorArray].detalle2[t].cantidad+$scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
												elem[t].cantidad=elem[t].stock*1;
											}
											else
											{
												elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
											}
										}	
									}
								}
							}
							else
							{
								for (var t =0;t< elem.length;t++) {
									for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
										if (elem[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
											if (elem[t].estadoID==4003 && (($scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
												elem[t].cantidad=elem[t].stock*1;
											}
											else
											{
												elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
											}
										}	
									}
								}
								if (CantidadTalla>0) {
									$scope.tallas[InidicadorArray].detalle2=elem;
								}
							}
							
						}
						ContadorColor=0;
						$scope.calcularDireferenciaTallasCalor();
					})	
				}
			}
		}

	}
	$scope.AgregarColoresMTalla=function(i)
	{
		if ($scope.ColorMasivoMedia.length==0) {
			return;
		}
		var CantidadBase=$scope.tallas[i].cantidad;
		if (CantidadBase% 1 != 0) {
			var cantidadColores=$scope.cantidadColor(i);
			if (((CantidadBase*12)-cantidadColores)==6) {
				CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
					debugger
					var CantidadTalla=0;
					var InidicadorArray=0;
					var ContadorColor=0;
					var ValidacionEstadoCompleto=true;
					if (elem.length>0) {
						InidicadorArray=elem[0].IndicadorArray;
						CantidadTalla=elem[0].cantidadextension1;	
						if ($scope.tallas[InidicadorArray].detalle2.length>0) {
							for (var t =0;t< $scope.tallas[InidicadorArray].detalle2.length;t++) {
								for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
									if ($scope.tallas[InidicadorArray].detalle2[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
										
										
										if (elem[t].estadoID==4003 && (($scope.tallas[InidicadorArray].detalle2[t].cantidad+$scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
											$scope.tallas[InidicadorArray].detalle2[t].cantidad=elem[t].stock*1;
										}
										else
										{
											$scope.tallas[InidicadorArray].detalle2[t].cantidad+=$scope.ColorMasivoMedia[x].cantidad;
										}
										
									}	
								}
							}
						}
						else
						{
							for (var t =0;t< elem.length;t++) {
								for (var x=0;x<$scope.ColorMasivoMedia.length;x++) {
									if (elem[t].extencionDetalle2ID==$scope.ColorMasivoMedia[x].extencionDetalle2ID) {
										if (elem[t].estadoID==4003 && (($scope.ColorMasivoMedia[x].cantidad))>elem[t].stock) {
											elem[t].cantidad=elem[t].stock*1;
										}
										else
										{
											elem[t].cantidad=$scope.ColorMasivoMedia[x].cantidad;
										}
										
									}	
								}
							}
							if (CantidadTalla>0) {
								$scope.tallas[InidicadorArray].detalle2=elem;
							}
						}
						
					}
					ContadorColor=0;
					$scope.calcularDireferenciaTallasCalor();
				})	
			}
		}

	}
	$scope.AgregarColoresMasivo=function()
	{
		$scope.ModalColorMasivo=false;
		if ($scope.ColorMasivo.length==0) {
			return
		}
		for (var i =0; i<$scope.tallas.length;i++ ) {
			var CantidadBase=$scope.tallas[i].cantidad;
			CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
				debugger
				var CantidadTalla=0;
				var InidicadorArray=0;
				var ContadorColor=0;
				var ValidacionEstadoCompleto=true;
				if (elem.length>0) {
					InidicadorArray=elem[0].IndicadorArray;
					CantidadTalla=elem[0].cantidadextension1;	
					for (var t =0;t< elem.length;t++) {
						for (var x=0;x<$scope.ColorMasivo.length;x++) {
							if (elem[t].extencionDetalle2ID==$scope.ColorMasivo[x].extencionDetalle2ID) {
								if (CantidadTalla % 1 == 0) {
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
										ContadorColor+=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
								else
								{
									ValidacionEstadoCompleto=false;
									CantidadTalla-=0.5
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
										ContadorColor+=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
							}	
						}
					}
					if (CantidadTalla>0) {
						$scope.tallas[InidicadorArray].detalle2=elem;
					}

				}
				ContadorColor=0;
				$scope.calcularDireferenciaTallasCalor();
			})			
		}
	}
	$scope.AgregarColoresMasivoTalla=function(TallaChange)
	{
		
		if ($scope.ColorMasivo.length==0) {
			return;
		}
		for (var i =0; i<$scope.tallas.length;i++ ) {
			var CantidadBase=$scope.tallas[i].cantidad;
			if ($scope.tallas[i].talla!=TallaChange) {
				continue;
			}
			CRUD.selectAllinOne("select a.*,0 as cantidad,'"+CantidadBase+"' as cantidadextension1,"+i+" as  IndicadorArray, d.rgba from erp_items_extenciones a inner join erp_item_extencion2_detalle d on d.rowid_erp=a.extencionDetalle2ID  where a.itemID='"+$scope.tallas[i].itemID+"'  and  a.extencionDetalle1ID='"+$scope.tallas[i].talla+"' order by extenciondetalle2id ",function(elem){
				if (elem.length>0) {
					var CantidadTalla=0;
					var InidicadorArray=0;
					var ContadorColor=0;
					var ValidacionEstadoCompleto=true;
					debugger
					InidicadorArray=elem[0].IndicadorArray;
					CantidadTalla=elem[0].cantidadextension1;
					for (var t =0;t< elem.length;t++) {
						
						for (var x=0;x<$scope.ColorMasivo.length;x++) {
							if (elem[t].extencionDetalle2ID==$scope.ColorMasivo[x].extencionDetalle2ID) {
								if (CantidadTalla % 1 == 0) {
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*CantidadTalla))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*CantidadTalla;
										ContadorColor+=$scope.ColorMasivo[x].cantidad*CantidadTalla;
									}
								}
								else
								{
									ValidacionEstadoCompleto=false;
									if (elem[t].estadoID==4003 && (($scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5)))>elem[t].stock) {
										elem[t].cantidad=elem[t].stock*1;
										ContadorColor+=elem[t].stock*1;
									}
									else
									{
										elem[t].cantidad=$scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5);
										ContadorColor+=$scope.ColorMasivo[x].cantidad*(CantidadTalla-0.5);
									}
									
								}
							}	
						}
					}

					ContadorColor=0;
					if (CantidadTalla>0) {
						$scope.tallas[InidicadorArray].detalle2=elem;
					}	
					if (CantidadTalla % 1 != 0) {
						$scope.AgregarColoresMTalla(InidicadorArray);
					}
					
					$scope.calcularDireferenciaTallasCalor();
				}
				
				
			})			
		}
	}
	$scope.sincronizar=function(){
		
		$scope.errorAlerta=[];
        $scope.errorAlerta.bandera=0;
        ProcesadoShow();   
        //$scope.EnvioActividades();
        //CRUD.Updatedynamic("update t_pedidos set sincronizado='EnvioCorrecto' where sincronizado='true'");
        window.setTimeout(function(){
            if ($scope.errorAlerta.bandera==1) {
                Mensajes('Error al Sincronizar, Por favor revise que su conexion sea estable','warning','');
                ProcesadoHiden();
                $route.reload();
                return
            }
            else
            {
                
                
            }
            CRUD.Updatedynamic("delete from crm_actividades");
            CRUD.Updatedynamic("delete from erp_items");
            CRUD.Updatedynamic("delete from erp_entidades_master");
            CRUD.Updatedynamic("delete from erp_items_precios");
            CRUD.Updatedynamic("delete  from erp_terceros");
            CRUD.Updatedynamic("delete from erp_terceros_punto_envio");
            CRUD.Updatedynamic("delete from erp_terceros_sucursales");
            CRUD.Updatedynamic("delete from m_estados");
            CRUD.Updatedynamic("delete from m_metaclass");
            CRUD.Updatedynamic("delete from crm_contactos");
            CRUD.Updatedynamic("delete from s_usuarios");
            CRUD.Updatedynamic("delete from erp_item_extension1");
            CRUD.Updatedynamic("delete from erp_item_extension2");
            CRUD.Updatedynamic("delete from erp_item_extencion1_detalle");
            CRUD.Updatedynamic("delete from erp_item_extencion2_detalle");
            CRUD.Updatedynamic("delete from erp_items_extenciones");
            CRUD.Updatedynamic("delete from t_pedidos_detalle_web");
            CRUD.Updatedynamic("delete from t_pedidos_web");
            
            //
            Sincronizar($scope.sessiondate.nombre_usuario,$scope.sessiondate.codigo_empresa);
            if (CONSTATE_SYNCT==1) {
                Mensajes("Error Conexion! Verificar Conexion.Sincronizar nuevamente","warning","");
                CONSTATE_SYNCT=0;
                ProcesadoHiden();
                return
            }
            else
            {
                Mensajes('Informacion Procesada','success','');
            }
            //Guardar Nuevos Datos
                var contador=0;
                var stringSentencia='';
                var NewQuery=true;
               for(var i=0; i < STEP_SINCRONIZACION.length; i++)
                {
                    var contador1=0;
                    contador=0;
                    NewQuery=true;
                    stringSentencia='';
                    for(var j=0; j < DATOS_ENTIDADES_SINCRONIZACION[i].length; j++) {
                        contador1++;
                        contador++;
                        if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0  ) {
                            //CRUD.insert('t_pedidos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //

                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_cliente_facturacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_cliente_despacho+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_bodega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_pedido+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_entrega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_solicitud+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].orden_compra+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].referencia+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_base+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_descuento+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_total+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numpedido_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numfactura_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].estado_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_facturado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cond_especial+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_doc+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cond_pago+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].numremision_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_co+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_conductor_cc+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_conductor_nombre+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].transporte_placa+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_nota+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].criterio_clasificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].modulo_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].sincronizado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].key_mobile+
                            "','1','00000000001' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0 ) {
                            //CRUD.insert('t_pedidos_detalle',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //debugger
                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_detalle_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_pedido+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_bodega+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].linea_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].factor+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad_base+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].precio_unitario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_motivo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].stock+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_base+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_descuento+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_total_linea+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].unidad_medida+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].num_lote+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_anulacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].flete+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento3+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].valor_porcen_descuento3+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].observaciones+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].empaque+"',1,1 "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_TERCEROS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_interno+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_identificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].razonsocial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_comercial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_cliente+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_proveedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].es_accionista+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].industria+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_industria+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clasificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_impuesto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_SUCURSALES && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros_sucursales',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (DATOS_ENTIDADES_SINCRONIZACION[i][j].length==0) {

                            }
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros_sucursales  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_tercero+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion2+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion3+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_postal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_ciudad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_depto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_pais+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_contacto+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email_contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].centro_operacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_condicion_pago+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad_negocio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_grupo_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_zona+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porcen_descuento+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_bloqueo_cupo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_bloqueo_mora+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cupo_credito+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_cliente+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clave+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_bodega+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_division+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_principal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_criterio_clasificacion+"' "; 
                            if (contador==499) {
                                
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_MAESTROS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_entidades_master',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_entidades_master  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_maestro+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_id_cia+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_rowid_maestro+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_id_maestro+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom1+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_disabled+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom2+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].custom3+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PEDIDOS_COLORES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_entidades_master',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into t_pedidos_detalle_detalle_web  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].pedidoDetalle+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemExtencion2Detalle+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_PUNTOS_ENVIO  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_terceros_punto_envio',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_terceros_punto_envio  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_tercero+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_sucursal+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_punto_envio+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_vendedor+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].direccion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].contacto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_items',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_referencia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_codigo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_linea+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_ext2+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad_venta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion_extensa+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].item_custom1+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].impuesto_id+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].impuesto_porcentaje+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion_adicional+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad_embalaje+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_inventario+"' "; 
                            
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEMS_PRECIOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('erp_items_precios',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items_precios  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_lista_precios+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_item_ext+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_unidad+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].precio_lista+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_activacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_inactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].estado_item+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ACTIVIDADES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_actividades',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            //debugger
                            if (NewQuery) {
                                stringSentencia=" insert into crm_actividades  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tema+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_prioridad+
                             "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_relacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].relacionado_a+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_inicial+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_final+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_relacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].sincronizado+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_METACLASS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('m_metaclass',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_metaclass  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].class_code+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_reg_codigo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_reg_nombre+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].CreatedBy+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].CreationDate+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ModifiedBy+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ModDate+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ESTADOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('m_estados',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_estados  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].id_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_estado+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_estado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_editar+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }
                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_CONTACTOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into crm_contactos  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_sucursal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombres+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].apellidos+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].telefono+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].skype+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ruta_imagen+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].celular+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].cargo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].area+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_principal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_modificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_modificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        } 
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_LOCALIZACION  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            if (NewQuery) {
                                stringSentencia=" insert into m_localizacion  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_tipo_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_localizacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_pais+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_depto+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_ciudad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].codigo_alterno+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_USUARIOS  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into s_usuarios  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_empresa+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].identificacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_codigo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_usuario+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_completo+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].email+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].clave+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_cambiarclave+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].acepto_condiciones+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].ind_activo+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].idioma+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].tipo_usuario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].coordinador_canal_deault+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].superior_rowid+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_canal_superior+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamod+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomod+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal_vendedor+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_CANALES  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into s_canales_usuario  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_usuario+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_canal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].nombre_canal+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuario_creacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fecha_creacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        } 
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION1  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extension1  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION2  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extension2  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariocreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION1_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extencion1_detalle  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion1ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_EXTENSION2_DETALLE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_item_extencion2_detalle  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion2ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].erp_descripcion_corta+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuariomodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechacreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechamodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rgba+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_ITEM_EXTENSION  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            //CRUD.insert('crm_contactos',DATOS_ENTIDADES_SINCRONIZACION[i][j]);
                            
                            if (NewQuery) {
                                stringSentencia=" insert into erp_items_extenciones  ";
                                NewQuery=false;
                            }
                            else{
                                stringSentencia+= "   UNION   ";
                            }
                            stringSentencia+=  "  SELECT  '"+
                            DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].id_cia+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencionDetalle1ID+
                            "', '"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencionDetalle2ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].indEstado+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaInactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaCreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fotoID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].notas+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioInactivacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioCreacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].usuarioModificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].fechaDodificacion+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion1ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].extencion2ID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowIDmovtoEntidad+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porMaxExcesoKit+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].porMinExcesoKit+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].UnidadValidacionID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].BarrasPrincipalID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].planKitID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].itemExtGenID+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].rowid_erp+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].stock+
                            "','"+DATOS_ENTIDADES_SINCRONIZACION[i][j].EstadoID+"' "; 
                            if (contador==499) {
                                CRUD.Updatedynamic(stringSentencia)
                                NewQuery=true;
                                stringSentencia="";
                                contador=0;
                            }

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_GRAFICA_DIARIO  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            GRAFICA_DIA_LABEL[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].dia;
                            GRAFICA_DIA_CANTIDAD[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad;

                        }
                        else if (STEP_SINCRONIZACION[i] == ENTIDAD_GRAFICA_MENSUAL  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            GRAFICA_MES_LABEL[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].mes;
                            GRAFICA_MES_CANTIDAD[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j].cantidad;

                        } 
                        else if (STEP_SINCRONIZACION[i] == TABLA_BALANCE  && DATOS_ENTIDADES_SINCRONIZACION[i].length!=0) {
                            
                            TABLA_BALANCE_DATOS[j]=DATOS_ENTIDADES_SINCRONIZACION[i][j];

                        } 
                    }
                    if (stringSentencia!='') {
                        CRUD.Updatedynamic(stringSentencia)
                        NewQuery=true;
                    }
                }
                localStorage.removeItem('TABLA_BALANCE'); 
                localStorage.setItem('TABLA_BALANCE',JSON.stringify(TABLA_BALANCE_DATOS));
                localStorage.removeItem('GRAFICA_MES_CANTIDAD'); 
                localStorage.setItem('GRAFICA_MES_CANTIDAD',JSON.stringify(GRAFICA_MES_CANTIDAD));
                localStorage.removeItem('GRAFICA_MES_LABEL');
                localStorage.setItem('GRAFICA_MES_LABEL',JSON.stringify( GRAFICA_MES_LABEL));
                localStorage.removeItem('GRAFICA_DIA_LABEL');
                localStorage.setItem('GRAFICA_DIA_LABEL',JSON.stringify( GRAFICA_DIA_LABEL));
                localStorage.removeItem('GRAFICA_DIA_CANTIDAD');
                localStorage.setItem('GRAFICA_DIA_CANTIDAD',JSON.stringify(GRAFICA_DIA_CANTIDAD)); 
                localStorage.removeItem('FECHA_SINCRONIZACION');
                var f = new Date();
                $scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
                var FechaSincronizacion=f.getHours() + ':'+f.getMinutes() +' '+diasSemana[f.getDay()] + ", " + f.getDate() + " de " + meses[f.getMonth()] + " de " + f.getFullYear();
                localStorage.setItem('FECHA_SINCRONIZACION',JSON.stringify(FechaSincronizacion)); 
                ULTIMA_EMPRESA_SINCRONIZADA=$scope.sessiondate.codigo_empresa;
            window.setTimeout(function(){
                ProcesadoHiden();
                //$route.reload();
                Mensajes('Sincronizado Con Exito','success','')
            },7000)
        },6000)
    }
}]);

app_angular.controller("PedidosController",['Conexion','$scope','$route',function (Conexion,$scope,$route) {
	$scope.sessiondate=JSON.parse(window.localStorage.getItem("CUR_USER"));
	$scope.validacion=false;
	$scope.pedidos = [];
	$scope.TABLA_BALANCE=JSON.parse(window.localStorage.getItem("TABLA_BALANCE"));
	$scope.pedidoSeleccionado=[];
	$scope.detallespedido=[];
	CRUD.select('select*from t_pedidos',function(elem){
	})
	$scope.cargarLista=function()
	{
		$scope.pedidos=[];
		CRUD.select('select distinct pedidos.sincronizado,pedidos.valor_impuesto,pedidos.fecha_solicitud,pedidos.sincronizado, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos,pedidos.numpedido_erp,pedidos.estado_erp from  t_pedidos pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio where pedidos.sincronizado!="EnvioCorrecto" and  pedidos.ambiente="'+$scope.sessiondate.codigo_empresa+'" and  pedidos.usuariocreacion="'+$scope.sessiondate.nombre_usuario+'" group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.rowid desc    LIMIT 50',
			function(elem) {elem.tablamobile=1;$scope.pedidos.push(elem)});
		window.setTimeout(function() {
			CRUD.select('select distinct pedidos.sincronizado,pedidos.valor_impuesto,pedidos.fecha_solicitud,pedidos.sincronizado, pedidos.rowid as rowidpedido,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total,detalle.rowid_pedido,count(detalle.rowid_pedido) cantidaddetalles,sum(detalle.cantidad) as cantidadproductos,pedidos.numpedido_erp,pedidos.estado_erp from  t_pedidos_web pedidos inner join erp_terceros_sucursales sucursal on sucursal.rowid=pedidos.rowid_cliente_facturacion  inner join erp_terceros terceros on terceros.rowid=sucursal.rowid_tercero  left  join t_pedidos_detalle_web detalle on detalle.rowid_pedido=pedidos.rowid left join erp_terceros_punto_envio punto_envio on punto_envio.rowid=pedidos.id_punto_envio where pedidos.usuariocreacion="'+$scope.sessiondate.nombre_usuario+'"  group by  pedidos.fecha_solicitud,detalle.rowid_pedido,pedidos.rowid,terceros.razonsocial,sucursal.nombre_sucursal,punto_envio.nombre_punto_envio,pedidos.valor_total order by pedidos.rowid desc    LIMIT 50',
			function(elem) {elem.tablamobile=0;$scope.pedidos.push(elem)});
		},2000);	
	}
	$scope.cargarLista();

	CRUD.select("select count(*) as cantidad",function(elem){
		if (elem.cantidad==0) {
			$scope.validacion=true;
		}
	})
	$scope.ConsultarDatos=function(pedido){
		$scope.detallespedido=[];
		$scope.pedidoSeleccionado=pedido;
		$scope.contadores=[];
		$scope.tallasAgregar=[];
		$scope.contadores.cont1=0;
		$scope.contadores.cont2=0;
		$scope.contadores.cont3=0;
		$scope.contadores.cont4=0;
		$scope.contadores.cont5=0;
		$scope.tabla1='';
		$scope.tabla2='';
		$scope.origen='';
		if (pedido.tablamobile==1) {
			$scope.tabla1='t_pedidos';
			$scope.tabla2='t_pedidos_detalle';
			$scope.origen='MOBILE';
		}
		else
		{
			$scope.tabla1='t_pedidos_web';
			$scope.tabla2='t_pedidos_detalle_web';	
			$scope.origen='WEB';
		}
		var query1="select distinct dt.rowid_item,dt.linea_descripcion,dt.rowid_pedido,item.item_referencia,dt.empaque  from "+$scope.tabla2+" dt inner join erp_items item on item.rowid=dt.rowid_item where dt.rowid_pedido ='"+pedido.rowidpedido+"'";

		CRUD.select(query1,function(elem){
			
			elem.tallas=[];
			elem.origen=$scope.origen;
			elem.cantidadtotal=0;
			$scope.detallespedido.unshift(elem);
			$scope.contadores.cont1++;
			var query2="select count(*) as c   from "+$scope.tabla2+" where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' ";
			CRUD.select(query2,function(contadorItems){
				var query3="select "+contadorItems.c+" as contador ,rowid_item_ext, item_ext1 as talla,cantidad,rowid_item from "+$scope.tabla2+" where rowid_item='"+elem.rowid_item+"'  and  rowid_pedido='"+elem.rowid_pedido+"' order by rowid_item_ext asc"
				CRUD.select(query3,function(tallas){
					$scope.contadores.cont4++;
					$scope.indicePush=true;
					$scope.indicemenor=true;
					for (var i =0;i<$scope.detallespedido.length;i++) {
						var a=$scope.detallespedido[i].rowid_item;
						if (a==tallas.rowid_item) {
							$scope.generico=[];
							$scope.generico.contador=0;
							$scope.generico.talla=0;
							$scope.generico.cantidad=0;
							$scope.generico.rowid_item=0;
							for (var f=1;f<9;f++) {
								$scope.generico.rowid_item_ext=f;
								if (f<tallas.rowid_item_ext && $scope.detallespedido[i].tallas.length+1!=tallas.rowid_item_ext && $scope.indicemenor) {
									$scope.detallespedido[i].tallas.push($scope.generico)
									
								}
								else if ( ($scope.indicePush && f==tallas.rowid_item_ext) || ($scope.detallespedido[i].tallas.length+1==tallas.rowid_item_ext  && $scope.indicePush))
								{
									$scope.detallespedido[i].tallas.push(tallas)
									$scope.detallespedido[i].cantidadtotal+=tallas.cantidad;
									$scope.contadores.cont5+=tallas.cantidad;
									$scope.indicemenor=false;
									$scope.indicePush=false;
								}
								else if ($scope.contadores.cont4>=tallas.contador) {
									
									if ($scope.detallespedido[i].tallas.length<8) {
										$scope.detallespedido[i].tallas.push($scope.generico)
									}
									if ($scope.detallespedido[i].tallas.length+1==9) {
										$scope.contadores.cont4=0;
									}
									
								}
								
							}
							
							
						}
						
					}
				})
			})
			
			
		})
			
	}
	$scope.Refrescar =function(){
		CRUD.selectAll('t_pedidos',function(elem) {$scope.pedidos.push(elem)});
		$scope.Search = '';
		
	}
	
	angular.element('ul.tabs li').click(function () {

		var tab_id = angular.element(this).find('a').data('tab');
		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');
		angular.element(this).toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	});
	
	$scope.abrirModal=function(pedido){
		$('#pedidoOpenModal').click();
		$scope.ConsultarDatos(pedido);
	}
	$scope.onretomarPedido=function(rowid_pedido){
	}
	//CRUD.Updatedynamic("delete from s_planos_pedidos");
	//CRUD.Updatedynamic("update t_pedidos set estado_sincronizacion=0,sincronizado='false' where rowid=10057");
	$scope.CambiarTab = function (tab_actual, accion) {
		var tab_id = null;

		if (tab_actual == '1' && accion == 'siguiente')
			tab_id = 'tab_2';

		angular.element('ul.tabs li').removeClass('active');
		angular.element('.tab-pane').removeClass('active');

		angular.element("ul.tabs").find("[data-tab='" + tab_id + "']").toggleClass('active');
		angular.element("#" + tab_id).toggleClass('active');
	};
	angular.element('#ui-id-1').mouseover(function (){
		angular.element('#ui-id-1').show();
	
	});
	//CRUD.selectAllinOne("select sum(tpd.cantidad) from t_pedidos p left join t_pedidos_detalle tpd on p.rowid=tpd.rowid_pedido  where p.rowid=10068",function(elem){debugger})
	//CRUD.selectAllinOne("select sum(tpdd.cantidad) from t_pedidos p left join t_pedidos_detalle tpd on p.rowid=tpd.rowid_pedido left join t_pedidos_detalle_detalle tpdd on tpd.rowid=tpdd.pedidoDetalle where p.rowid=10069",function(elem){debugger})
	//CRUD.select("select sum(d_cantidad) from s_planos_pedidos where e_rowid=10068",function(elem){debugger})
	//CRUD.select("select count(*) from t_pedidos_detalle where rowid_pedido=10068",function(elem){debugger})
	$scope.build=function(rowid){
		$('.confirmarEnvio').attr('disabled','disabled');
		ProcesadoShow();   
		$scope.queryBuild='    select  '+
		   ' t.key_user,'+
		   ' t.rowid_empresa,'+
			't.id_cia,t.usuariocreacion,'+
			't.fechacreacion,'+
			't.rowid as e_rowid, '+
			't.rowid_cliente_facturacion as  e_rowid_cliente_facturacion,'+
			't.rowid_cliente_despacho as e_rowid_cliente_despacho,'+
			't.rowid_lista_precios as e_rowid_lista_precios,'+
			't.id_punto_envio as e_id_punto_envio,'+
			't.fecha_pedido as e_fecha_pedido,'+
			't.fecha_entrega as e_fecha_entrega,'+
			't.valor_base as e_valor_base,'+
			't.valor_descuento as e_valor_descuento,'+
			't.valor_impuesto as e_valor_impuesto,'+
			't.valor_total as e_valor_total,'+
			't.id_estado as e_id_estado,'+
			't.ind_estado_erp as e_ind_estado_erp,'+
			't.valor_facturado as e_valor_facturado,'+
			't.fecha_solicitud as e_fechasolicitud,'+
			't.orden_compra as e_orden_compra,'+
			't.modulo_creacion as e_modulo_creacion,'+
			't.observaciones as e_observaciones,'+
			'tpd.rowid as d_rowid,'+
			'tpd.rowid_pedido as d_rowid_pedido,'+
			'tpd.rowid_item as d_rowid_item,'+
			'tpd.linea_descripcion as d_linea_descripcion,'+
			'tpd.id_unidad as d_id_unidad,'+
			'tpd.cantidad as d_cantidad,'+
			'tpd.factor as d_factor,'+
			'tpd.cantidad_base as d_cantidad_base,'+
		   'tpd.stock as d_stock,'+
			'tpd.porcen_descuento as d_porcen_descuento,'+
			'tpd.valor_base as d_valor_base,'+
			'tpd.valor_impuesto as d_valor_impuesto,'+
			'tpd.valor_total_linea as d_valor_total_linea,'+
			'tpd.item_ext1 as d_item_ext1,'+
			'tpd.rowid_item_ext as d_rowid_item_ext,'+
			'tpd.empaque as d_empaque,'+
			'tpd.observaciones as d_observaciones,'+
			'tpd.rowid_bodega as d_rowid_bodega,'+
			'tpd.precio_unitario as d_precio_unitario,'+
			'tpd.valor_descuento as d_valor_descuento,'+
			'tpdd.rowid as s_rowid,'+
			'tpdd.pedidodetalle as s_rowid_detalle,'+
			'tpdd.cantidad as s_cantidad,'+
			'tpdd.itemExtension2Detalle as s_itemextencion2detalle '+
			' from t_pedidos t'+
			' inner  join  t_pedidos_detalle tpd '+
			' on tpd.rowid_pedido=t.rowid'+
			' inner  join t_pedidos_detalle_detalle tpdd '+
			' on tpdd.pedidodetalle=tpd.rowid   where  t.rowid= __REQUIRED  and estado_sincronizacion=0 '+
			' order by t.rowid asc';


		$scope.queryBuild=$scope.queryBuild.replace('__REQUIRED',$scope.pedidoSeleccionado.rowid_pedido)
		CRUD.selectAllinOne($scope.queryBuild,function(ped){
				var rowidPedido=0;
				var contador=0;
				var  stringSentencia='';
				var NewQuery=true;
				var ultimoregistro=ped.length-1;
				var step=0;
				for (var i =0;i<ped.length;i++) {
					contador++
					if (ultimoregistro==i) {
						step=1
					}
					rowidPedido=ped[i].e_rowid
					if (NewQuery) {
						stringSentencia=" insert into s_planos_pedidos  ";
						NewQuery=false;
					}
					else{
						stringSentencia+= "   UNION   ";
					}
					stringSentencia+=  "  SELECT  "+
					//ped[i].e_rowid+

					"null,'"+ped[i].key_user+
					"','"+ped[i].rowid_empresa+
					"','"+ped[i].id_cia+
					"','"+ped[i].key_user+
					"','"+ped[i].usuariocreacion+
					"','"+ped[i].fechacreacion+
					"','"+ped[i].e_rowid+
					"','"+ped[i].e_rowid_cliente_facturacion+
					"','"+ped[i].e_rowid_cliente_despacho+
					"','"+ped[i].e_rowid_lista_precios+
					"','"+ped[i].e_id_punto_envio+
					"','"+ped[i].e_fecha_pedido+
					"','"+ped[i].e_fecha_entrega+
					"','"+ped[i].e_valor_base+
					"','"+ped[i].e_valor_descuento+
					"','"+ped[i].e_valor_impuesto+
					"','"+ped[i].e_valor_total+
					"','"+ped[i].e_id_estado+
					"','"+ped[i].e_ind_estado_erp+
					"','"+ped[i].e_valor_facturado+
					"','"+ped[i].e_fechasolicitud+
					"','"+ped[i].e_orden_compra+
					"','"+ped[i].e_modulo_creacion+
					"','"+ped[i].e_observaciones+
					"','"+ped[i].d_rowid+
					"','"+ped[i].d_rowid_pedido+
					"','"+ped[i].d_rowid_item+
					"','"+ped[i].d_linea_descripcion+
					"','"+ped[i].d_id_unidad+
					"','"+ped[i].d_cantidad+
					"','"+ped[i].d_factor+
					"','"+ped[i].d_cantidad_base+
					"','"+ped[i].d_stock+
					"','"+ped[i].d_porcen_descuento+
					"','"+ped[i].d_valor_base+
					"','"+ped[i].d_valor_impuesto+
					"','"+ped[i].d_valor_total_linea+
					"','"+ped[i].d_item_ext1+
					"','"+ped[i].d_rowid_item_ext+
					"','"+ped[i].d_empaque+
					"','"+ped[i].d_observaciones+
					"','"+ped[i].d_rowid_bodega+
					"','"+ped[i].s_rowid+
					"','"+ped[i].s_rowid_detalle+
					"','"+ped[i].s_cantidad+
					"','"+ped[i].s_itemextencion2detalle+
					"',0,"+step+",0,0,'"+ped[i].d_precio_unitario+"','"+ped[i].d_valor_descuento+"','"+ped.length+"' "; 
					if (contador==499) {
						CRUD.Updatedynamic(stringSentencia)
						NewQuery=true;
						stringSentencia="";
						contador=0;
					}
				}
				if (stringSentencia!='') {
					CRUD.Updatedynamic(stringSentencia)
					NewQuery=true;
					CRUD.Updatedynamic("update t_pedidos set estado_sincronizacion=1,sincronizado='plano' where rowid="+rowidPedido+"");
				}
				window.setTimeout(function(){
					ProcesadoHiden();
					//$route.reload();
					Mensajes('Listo Para Enviar','success','');
					$scope.pedidos=[];
					$scope.cargarLista();
					$(".confirmarEnvio").removeAttr("disabled");
					$('#modalClose').click();
				},25000)
			})

		
	}
	$scope.ItemModal=[];
	$scope.ColoresModal=[];
	$scope.ModalColoreOpen=false;
	$scope.ModalItem=function(item){
		if (item.origen=="WEB") {
			$scope.ColoresModal=[];
			$scope.ModalColoreOpen=true;
			$('#ColoresAgregados').click();
			$scope.ItemModal=[];
			$scope.ItemModal=angular.copy(item)	;
			for (var i = 0; i < $scope.ItemModal.tallas.length; i++) {
				if ( $scope.ItemModal.tallas[i].cantidad>0) {
					$scope.ItemModal.tallas[i].colores=[];
					CRUD.selectAllinOne("select  '"+i+"' as array,c.*,b.cantidad from t_pedidos_detalle_web a inner join t_pedidos_detalle_detalle_web  b on b.pedidoDetalle=a.rowid left join erp_item_extencion2_detalle c on c.rowid_erp=b.itemExtension2Detalle  where a.rowid_pedido='"+item.rowid_pedido+"' and  a.rowid_item='"+item.rowid_item+"'  and a.item_ext1='"+$scope.ItemModal.tallas[i].talla+"'",function(elem){
						if (elem.length>0) {
							$scope.ItemModal.tallas[elem[0].array].colores=elem;
						}
					})
				}
				else
				{
					$scope.ItemModal.tallas[i]=[];			
				}
			}
		}
		else
		{
			$scope.ColoresModal=[];
			$scope.ModalColoreOpen=true;
			$('#ColoresAgregados').click();
			$scope.ItemModal=[];
			$scope.ItemModal=angular.copy(item)	;
			for (var i = 0; i < $scope.ItemModal.tallas.length; i++) {
				if ( $scope.ItemModal.tallas[i].cantidad>0) {
					$scope.ItemModal.tallas[i].colores=[];
					CRUD.selectAllinOne("select  '"+i+"' as array,c.*,b.cantidad from t_pedidos_detalle a inner join t_pedidos_detalle_detalle  b on b.pedidoDetalle=a.rowid left join erp_item_extencion2_detalle c on c.rowid_erp=b.itemExtension2Detalle  where a.rowid_pedido='"+item.rowid_pedido+"' and  a.rowid_item='"+item.rowid_item+"'  and a.item_ext1='"+$scope.ItemModal.tallas[i].talla+"'",function(elem){
						if (elem.length>0) {
							$scope.ItemModal.tallas[elem[0].array].colores=elem;
						}
					})
				}
				else
				{
					$scope.ItemModal.tallas[i]=[];	
					$scope.ItemModal.tallas[i].cantidad=0;		
				}
			}
		}
		
	}
	$scope.$on('$routeChangeStart', function(event,next, current) { 
		if ($scope.ModalColoreOpen==true) {
			$scope.ModalColoreOpen=false;
			event.preventDefault();
			$('#modalBalanceColores').click();
			return;
		}
		
		  
	 });
}]);


app_angular.controller("PedidosTemporalesController",['Conexion','$scope',function (Conexion,$scope) {
	
	
}]);



