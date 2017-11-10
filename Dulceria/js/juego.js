		var ctx, canvas;
		var primerCarta = true;
		var cartaPrimera, cartaSegunda;
		var colorDelante="white";
		var colorAtras="../img/PCupcakeschampagne.jpg";
		var colorCanvas="gray";
		var inicioX=50;//separacion de las cartas con respecto a x
		var inicioY=30;//separacion entre las cartas con respecto a y
		var cartaMargen=30;
		var cartaLon=30;
		var cartaAncho=cartaLon*4;//ancho de la carta
		var cartaAlto=cartaLon*4;//largo de la carta
		var cartas_array=new Array();//array de cartas
		var iguales=false;
		var cartas=0;

		window.onload = iniciar;

		function iniciar(){
			canvas=document.getElementById("miCanvas");//Returns a reference to the element by its ID
			canvas.width=1000;//tamaño del tablero ancho
			canvas.height=600;//tamaño del tablero alto
			if(canvas && canvas.getContext){//method returns a drawing context on the canvas, or null if the context identifier is not supported.
				ctx = canvas.getContext("2d");//Is a DOMString containing the context identifier defining the drawing context associated to the canvas.
				if(ctx){//"2d", leading to the creation of a CanvasRenderingContext2D object representing a two-dimensional rendering context
					canvas.removeEventListener("click",iniciar,false);//method removes from the EventTarget an event listener previously registered with EventTarget.addEventListener().
					canvas.addEventListener("click",selecciona,false);//method adds the specified EventListener-compatible object to the list of event listeners for the specified event type on the EventTarget on which it is called.
					tablero();//inicia el tablero
					barajar();//barajea
					aciertos();//inicia aciertos
				}else{//si no retorna algo diferente de 0 significa que identificador de contexto no lo soporta 
					document.write("Tu navegador no soporta canvas");
				}
			}
		}
		function tablero(){
			var i, j;//iteradores
			var carta;
			var x=inicioX;//Separacion de las cartas respecto a x(50)
			var y=inicioY;//Separacion de las cartas respecto a y(30)
			for(i=0; i<6; i++){//asignacion de columnas
				for(j=0; j<3; j++){//asignacion de filasproperty of the Canvas 2D API specifies the color or style to use inside shapes. 
					carta=new Carta(x,y,cartaAncho,cartaAlto,i);//crea carta con ancho,alto,separacion xy 
					cartas_array.push(carta);//Se agregan al arreglo
					carta.dibuja();//se dibujan

					y +=inicioY+cartaAlto;
				}
				y = inicioY;
				x+=cartaAncho+cartaMargen;
			}
		}

		function Carta(x,y,ancho,largo,info){//funcion carta que inicializa una carta
			this.x=x;
			this.y=y;
			this.ancho=ancho;
			this.largo=largo;
			this.info=info;
			this.dibuja=dibujaCarta;
		}
		function dibujaCarta(){
			ctx.fillStyle=colorAtras;//fillstyle: property of the Canvas 2D API specifies the color or style to use inside shapes. 
			ctx.fillRect(this.x,this.y,this.ancho,this.largo);
		}
		function barajar(){
			var i,j;
			var aTemp1= new Array();
			var aTemp2= new Array();
			var lon=cartas_array.length/2;
			for(i=0; i<lon;i++){
				do{
					j=Math.floor(Math.random()*lon);
				}while(aTemp1.indexOf(j)!=-1)
				aTemp1.push(j);
				do{
					j=Math.floor(Math.random()*lon);
				}while(aTemp2.indexOf(j)!=-1)
				aTemp2.push(j);
			}
			aTemp1 = aTemp2.concat(aTemp1);
			for(i=0; i<lon*2; i++){
				cartas_array[i].info=aTemp1[i];
			}
		}

		function ajusta(xx,yy){
			var posCanvas = canvas.getBoundingClientRect();
			var x = xx-posCanvas.left;
			var y = yy-posCanvas.top;
			return {x:x,y:y}
		}
		function selecciona(e){
			var pos=ajusta(e.clientX,e.clientY);
			//alert(pos.x+','+pos.y);

			for(var i=0; i<cartas_array.length; i++){
				var carta = cartas_array[i];
				if(carta.x>0){
					if( (pos.x>carta.x) && (pos.x<carta.x+carta.ancho) && (pos.y>carta.y) && (pos.y<carta.y+carta.largo)){
						if((primerCarta) || (i!=cartaPrimera)) {
							break;
						}
					}
				}
			}
			if(i<cartas_array.length){
				if(primerCarta){
					cartaPrimera=i;
					primerCarta=false;
					pinta(carta);
				}else{
					canvas.removeEventListener("click",selecciona,false);
					cartaSegunda=i;
					pinta(carta);
					primerCarta=true;
					if(cartas_array[cartaPrimera].info==cartas_array[cartaSegunda].info){
						iguales=true;
						cartas++;
						aciertos();
					}else{
						iguales=false;
					}
					setTimeout(volteaCarta,1000);
				}
			}
		}
		function pinta(carta){
			ctx.fillStyle = colorDelante;
			ctx.fillRect(carta.x,carta.y,carta.ancho,carta.largo);

			ctx.font="bold 40px comic";
			ctx.fillStyle = "black";
			ctx.fillText(String(carta.info), carta.x+carta.ancho/2-10, carta.y+carta.largo/2+10);
		}
		function volteaCarta(){
			if(!iguales){
				cartas_array[cartaPrimera].dibuja();
				cartas_array[cartaSegunda].dibuja();
			}else{
				ctx.clearRect(	cartas_array[cartaPrimera].x,
					cartas_array[cartaPrimera].y,
					cartas_array[cartaPrimera].ancho,
					cartas_array[cartaPrimera].largo);

				ctx.clearRect(	cartas_array[cartaSegunda].x,
					cartas_array[cartaSegunda].y,
					cartas_array[cartaSegunda].ancho,
					cartas_array[cartaSegunda].largo);

				cartas_array[cartaPrimera].x = -1;
				cartas_array[cartaSegunda].x = -1;
			}
			if(cartas<6){
				canvas.addEventListener("click",selecciona,false);
			}else{
				cartas=0;
				cartas_array=[];
				canvas.addEventListener("click",iniciar,false);
				ctx.fillStyle="white";
				ctx.fillText("Ganaste!!",120,canvas.height/2);
			}
		}

		function aciertos(){
			ctx.save();
			ctx.clearRect(0,480,canvas.width,canvas.height);
			ctx.fillStyle="gray"
			ctx.fillRect(0,480,canvas.width,canvas.height);
			ctx.font = "bold 35px comic";
			ctx.fillStyle="black";
			ctx.fillText("Aciertos: "+String(cartas),canvas.width-520,509);
			ctx.restore();
		}
