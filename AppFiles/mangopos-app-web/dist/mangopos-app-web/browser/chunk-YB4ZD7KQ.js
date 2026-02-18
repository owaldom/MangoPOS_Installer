import{b as vt}from"./chunk-R7JIR2Y5.js";import{a as yt}from"./chunk-HLIXJ3A2.js";import{a as b,b as xt,c as Mt}from"./chunk-YCYMFYGN.js";import{b as bt,c as D}from"./chunk-HIZ742YJ.js";import{a as z,b as W}from"./chunk-26KDQVR5.js";import{a as kt}from"./chunk-DGQM6DPS.js";import{a as it}from"./chunk-SCPRHZYR.js";import{b as et,c as ot}from"./chunk-APXOZHQA.js";import{a as rt,b as lt,c as ct,d as dt,e as mt,f as st,g as pt,h as ft,i as ut,j as gt,k as ht,l as _t,m as St}from"./chunk-VJGP4MMT.js";import{a as Ct,b as wt}from"./chunk-VNZMNOUU.js";import"./chunk-YCMZOG5D.js";import{a as V,c as J,h as K}from"./chunk-ZWM7H6SC.js";import"./chunk-PALJ6VDH.js";import"./chunk-TEMJ73U5.js";import{d as A}from"./chunk-52A733DE.js";import"./chunk-GPHRSLLH.js";import{b as G,f as Y,i as Z,j as tt}from"./chunk-EWTXOCXT.js";import{b as Q,f as X,j as q,x as U}from"./chunk-AVLO2MYP.js";import{a as nt,b as at}from"./chunk-JI7GBIO6.js";import"./chunk-VTP6RNFS.js";import{H as j,I as H,K as N}from"./chunk-M7DMR53X.js";import"./chunk-JAVK727W.js";import"./chunk-3TNWXQYU.js";import"./chunk-UWUK32S4.js";import{k as B,r as T,s as C,v as F}from"./chunk-ZD4QWOHN.js";import{$ as g,$b as k,Fb as s,Gb as o,Hb as n,Ib as w,Mb as h,Nb as _,Ub as S,Wa as c,Wb as L,_b as O,ac as x,gc as I,ic as i,jb as R,kc as f,nc as M,oc as y,pb as p,pc as v,rc as $,vc as E,xc as P}from"./chunk-WSMHJDAT.js";import"./chunk-C6Q5SG76.js";function Pt(t,l){if(t&1&&(o(0,"mat-option",9),i(1),n()),t&2){let e=l.$implicit;s("value",e.id),c(),f(" ",e.name," ")}}function Tt(t,l){t&1&&(o(0,"th",31),i(1," Referencia "),n())}function Dt(t,l){if(t&1&&(o(0,"td",32),i(1),n()),t&2){let e=l.$implicit;c(),f(" ",e.reference," ")}}function Rt(t,l){t&1&&(o(0,"th",31),i(1," C\xF3digo "),n())}function Lt(t,l){if(t&1&&(o(0,"td",32),i(1),n()),t&2){let e=l.$implicit;c(),f(" ",e.code," ")}}function Ot(t,l){t&1&&(o(0,"th",31),i(1," Nombre "),n())}function It(t,l){if(t&1&&(o(0,"td",32),i(1),n()),t&2){let e=l.$implicit;c(),f(" ",e.name," ")}}function $t(t,l){t&1&&(o(0,"th",31),i(1," Categor\xEDa "),n())}function Bt(t,l){if(t&1&&(o(0,"td",32),i(1),n()),t&2){let e=l.$implicit;c(),f(" ",e.category_name," ")}}function Ft(t,l){t&1&&(o(0,"th",31),i(1," Stock M\xEDnimo "),n())}function At(t,l){if(t&1&&(o(0,"td",33),i(1),E(2,"number"),n()),t&2){let e=l.$implicit;c(),f(" ",P(2,1,e.min_stock,"1.0-3")," ")}}function jt(t,l){t&1&&(o(0,"th",31),i(1," Stock Actual "),n())}function Ht(t,l){if(t&1&&(o(0,"td",33)(1,"span"),i(2),E(3,"number"),n()()),t&2){let e=l.$implicit;c(),I("stock-critical",e.current_stock<=0)("stock-warning",e.current_stock>0),c(),f(" ",P(3,5,e.current_stock,"1.0-3")," ")}}function Nt(t,l){t&1&&w(0,"tr",34)}function zt(t,l){t&1&&w(0,"tr",35)}function Wt(t,l){if(t&1&&(o(0,"tr",36)(1,"td",37),i(2),n()()),t&2){let e=L();c(2),f(" ",e.loading?"Cargando datos...":"No se encontraron productos con stock bajo."," ")}}var be=(()=>{class t{stockService=g(vt);categoryService=g(yt);snackBar=g(z);settingsService=g(kt);datePipe=g(T);decimalPipe=g(C);displayedColumns=["reference","code","name","category_name","min_stock","current_stock"];dataSource=new St([]);categories=[];loading=!1;filters={categoryId:null,search:""};sharedPaginator;sort;ngOnInit(){this.loadCategories(),this.loadReport()}loadCategories(){this.categoryService.getAll(1,200).subscribe(e=>{this.categories=e.data})}loadReport(){this.loading=!0,this.stockService.getLowStockReport(this.filters).subscribe({next:e=>{this.dataSource.data=e,setTimeout(()=>{this.sharedPaginator&&this.sharedPaginator.paginator&&(this.dataSource.paginator=this.sharedPaginator.paginator)}),this.dataSource.sort=this.sort,this.loading=!1},error:e=>{console.error("Error al cargar reporte:",e),this.snackBar.open("Error al cargar reporte de stock bajo","Cerrar",{duration:3e3}),this.loading=!1}})}exportExcel(){if(this.dataSource.data.length===0)return;let e=["Referencia","Codigo","Nombre","Categoria","Stock Minimo","Stock Actual"],m=this.dataSource.data.map(u=>[`"${u.reference}"`,`"${u.code}"`,`"${u.name}"`,`"${u.category_name}"`,u.min_stock,u.current_stock]),a=[e.join(","),...m.map(u=>u.join(","))].join(`
`),d=new Blob([a],{type:"text/csv;charset=utf-8;"}),r=document.createElement("a"),Et=URL.createObjectURL(d);r.setAttribute("href",Et),r.setAttribute("download",`StockBajo_${new Date().toISOString().split("T")[0]}.csv`),r.style.visibility="hidden",document.body.appendChild(r),r.click(),document.body.removeChild(r)}exportPdf(){let e=window.open("","_blank","width=800,height=600");if(!e){this.snackBar.open("Por favor permita las ventanas emergentes para ver el reporte","Cerrar",{duration:3e3});return}let m=this.filters.categoryId?this.categories.find(r=>r.id===this.filters.categoryId)?.name||"Seleccionada":"Todas",a=this.dataSource.data.map(r=>`
        <tr>
            <td>${r.reference}</td>
            <td>${r.code}</td>
            <td>${r.name}</td>
            <td>${r.category_name}</td>
            <td style="text-align: right;">${this.decimalPipe.transform(r.min_stock,"1.0-3")}</td>
            <td style="text-align: right; color: ${r.current_stock<=0?"#d32f2f":"#f57c00"}; font-weight: bold;">
                ${this.decimalPipe.transform(r.current_stock,"1.0-3")}
            </td>
        </tr>
    `).join(""),d=`
        <html>
        <head>
            <title>Reporte de Stock Bajo</title>
            <style>
                body { font-family: Arial, sans-serif; font-size: 12px; color: #333; margin: 30px; }
                .report-header { text-align: center; margin-bottom: 30px; }
                h1 { color: #d32f2f; margin: 0; font-size: 24px; letter-spacing: 1px; }
                .report-header p { margin: 5px 0; color: #666; font-size: 14px; }
                .metadata { margin-bottom: 20px; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #d32f2f; }
                .metadata table { width: 100%; border: none; }
                .metadata td { border: none; padding: 3px 0; }
                table.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
                table.data-table th, table.data-table td { border: 1px solid #dee2e6; padding: 10px 8px; text-align: left; }
                table.data-table th { background-color: #f1f3f5; font-weight: bold; text-transform: uppercase; font-size: 10px; color: #495057; }
                table.data-table tr:nth-child(even) { background-color: #fcfcfc; }
                .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 15px; }
                .text-right { text-align: right; }
                @media print {
                  @page { margin: 15mm; }
                }
            </style>
        </head>
        <body>
            <div class="report-header">
                <h1>REPORTE DE STOCK BAJO</h1>
                <p>Inventario de Reposici\xF3n Cr\xEDtica</p>
            </div>
            
            <div class="metadata">
                <table>
                    <tr>
                        <td width="50%"><strong>Empresa:</strong> Mango POS Sun Market</td>
                        <td width="50%" class="text-right"><strong>Fecha Emisi\xF3n:</strong> ${this.datePipe.transform(new Date,"dd/MM/yyyy HH:mm")}</td>
                    </tr>
                    <tr>
                        <td><strong>Filtro Categor\xEDa:</strong> ${m}</td>
                        <td class="text-right"><strong>Total Productos:</strong> ${this.dataSource.data.length}</td>
                    </tr>
                </table>
            </div>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Referencia</th>
                        <th>C\xF3digo</th>
                        <th>Descripci\xF3n Producto</th>
                        <th>Categor\xEDa</th>
                        <th class="text-right">M\xEDnimo</th>
                        <th class="text-right">Actual</th>
                    </tr>
                </thead>
                <tbody>
                    ${a}
                </tbody>
            </table>

            <div class="footer">
                Documento generado autom\xE1ticamente por el Sistema Mango POS - Control de Inventario
            </div>

            <script>
                window.onload = function() { 
                    window.print(); 
                    // window.close();
                }
            <\/script>
        </body>
        </html>
    `;e.document.write(d),e.document.close()}static \u0275fac=function(m){return new(m||t)};static \u0275cmp=R({type:t,selectors:[["app-low-stock"]],viewQuery:function(m,a){if(m&1&&O(D,5)(b,5),m&2){let d;k(d=x())&&(a.sharedPaginator=d.first),k(d=x())&&(a.sort=d.first)}},features:[$([T,C])],decls:57,vars:11,consts:[[1,"container"],[1,"header"],[1,"actions"],["mat-stroked-button","","color","primary",3,"click","disabled"],["mat-stroked-button","","color","accent",3,"click","disabled"],[1,"filter-card"],[1,"filter-row"],["appearance","outline"],[3,"ngModelChange","selectionChange","ngModel"],[3,"value"],[3,"value",4,"ngFor","ngForOf"],["appearance","outline",1,"search-field"],["matInput","","placeholder","Nombre, c\xF3digo o referencia",3,"ngModelChange","keyup.enter","ngModel"],["mat-icon-button","","matSuffix","",3,"click"],["mat-flat-button","","color","primary",1,"filter-btn",3,"click"],[1,"table-card"],[1,"table-container"],["mat-table","","matSort","",3,"dataSource"],["matColumnDef","reference"],["mat-header-cell","","mat-sort-header","",4,"matHeaderCellDef"],["mat-cell","",4,"matCellDef"],["matColumnDef","code"],["matColumnDef","name"],["matColumnDef","category_name"],["matColumnDef","min_stock"],["mat-cell","","class","text-right",4,"matCellDef"],["matColumnDef","current_stock"],["mat-header-row","",4,"matHeaderRowDef"],["mat-row","",4,"matRowDef","matRowDefColumns"],["class","mat-row",4,"matNoDataRow"],[3,"length","pageSize"],["mat-header-cell","","mat-sort-header",""],["mat-cell",""],["mat-cell","",1,"text-right"],["mat-header-row",""],["mat-row",""],[1,"mat-row"],["colspan","6",1,"text-center","p-20"]],template:function(m,a){m&1&&(o(0,"div",0)(1,"div",1)(2,"h1"),i(3,"Consulta de Stock Bajo"),n(),o(4,"div",2)(5,"button",3),S("click",function(){return a.exportExcel()}),o(6,"mat-icon"),i(7,"table_view"),n(),i(8," EXPORTAR A EXCEL "),n(),o(9,"button",4),S("click",function(){return a.exportPdf()}),o(10,"mat-icon"),i(11,"picture_as_pdf"),n(),i(12," EXPORTAR REPORTE "),n()()(),o(13,"mat-card",5)(14,"mat-card-content")(15,"div",6)(16,"mat-form-field",7)(17,"mat-label"),i(18,"Categor\xEDa"),n(),o(19,"mat-select",8),v("ngModelChange",function(r){return y(a.filters.categoryId,r)||(a.filters.categoryId=r),r}),S("selectionChange",function(){return a.loadReport()}),o(20,"mat-option",9),i(21,"Todas las Categor\xEDas"),n(),p(22,Pt,2,2,"mat-option",10),n()(),o(23,"mat-form-field",11)(24,"mat-label"),i(25,"Buscar producto..."),n(),o(26,"input",12),v("ngModelChange",function(r){return y(a.filters.search,r)||(a.filters.search=r),r}),S("keyup.enter",function(){return a.loadReport()}),n(),o(27,"button",13),S("click",function(){return a.loadReport()}),o(28,"mat-icon"),i(29,"search"),n()()(),o(30,"button",14),S("click",function(){return a.loadReport()}),i(31," FILTRAR "),n()()()(),o(32,"mat-card",15)(33,"div",16)(34,"table",17),h(35,18),p(36,Tt,2,0,"th",19)(37,Dt,2,1,"td",20),_(),h(38,21),p(39,Rt,2,0,"th",19)(40,Lt,2,1,"td",20),_(),h(41,22),p(42,Ot,2,0,"th",19)(43,It,2,1,"td",20),_(),h(44,23),p(45,$t,2,0,"th",19)(46,Bt,2,1,"td",20),_(),h(47,24),p(48,Ft,2,0,"th",19)(49,At,3,4,"td",25),_(),h(50,26),p(51,jt,2,0,"th",19)(52,Ht,4,8,"td",25),_(),p(53,Nt,1,0,"tr",27)(54,zt,1,0,"tr",28)(55,Wt,3,1,"tr",29),n()(),w(56,"app-shared-paginator",30),n()()),m&2&&(c(5),s("disabled",a.dataSource.data.length===0),c(4),s("disabled",a.dataSource.data.length===0),c(10),M("ngModel",a.filters.categoryId),c(),s("value",null),c(2),s("ngForOf",a.categories),c(4),M("ngModel",a.filters.search),c(8),s("dataSource",a.dataSource),c(19),s("matHeaderRowDef",a.displayedColumns),c(),s("matRowDefColumns",a.displayedColumns),c(2),s("length",a.dataSource.data.length)("pageSize",50))},dependencies:[F,B,U,Q,X,q,K,V,J,N,H,j,at,nt,_t,rt,ct,pt,dt,lt,ft,mt,st,ut,gt,ht,bt,D,Mt,b,xt,tt,Z,G,Y,ot,et,wt,Ct,A,W,it,C],styles:[".container[_ngcontent-%COMP%]{padding:24px}.header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;margin-bottom:24px}.actions[_ngcontent-%COMP%]{display:flex;gap:10px}.filter-card[_ngcontent-%COMP%]{margin-bottom:20px}.filter-row[_ngcontent-%COMP%]{display:flex;gap:15px;align-items:baseline}.search-field[_ngcontent-%COMP%]{flex:1}.filter-btn[_ngcontent-%COMP%]{height:50px}.full-width[_ngcontent-%COMP%]{width:100%}.table-container[_ngcontent-%COMP%]{overflow-x:auto}.text-right[_ngcontent-%COMP%]{text-align:right}.text-center[_ngcontent-%COMP%]{text-align:center}.p-20[_ngcontent-%COMP%]{padding:20px}.stock-critical[_ngcontent-%COMP%]{color:#f44336;font-weight:700}.stock-warning[_ngcontent-%COMP%]{color:#ff9800;font-weight:700}"]})}return t})();export{be as LowStockComponent};
