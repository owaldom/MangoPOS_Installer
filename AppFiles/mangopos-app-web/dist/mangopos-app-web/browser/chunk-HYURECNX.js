import{a as P}from"./chunk-2UF7BHSI.js";import{a as S}from"./chunk-DGQM6DPS.js";import{r as x,s as w,u as $}from"./chunk-ZD4QWOHN.js";import{$ as d,W as b,n as y}from"./chunk-WSMHJDAT.js";var I=(()=>{class p{settingsService=d(S);thermalPrinterService=d(P);currencyPipe=d($);datePipe=d(x);decimalPipe=d(w);async printTicket(t){try{console.log("Intentando imprimir en impresora t\xE9rmica...");let s=await y(this.thermalPrinterService.printTicket(t));return s.success?(console.log("\u2705 Ticket impreso exitosamente en impresora t\xE9rmica"),{success:!0,usedThermal:!0}):(console.error("\u274C Error en impresi\xF3n t\xE9rmica:",s.error),this.settingsService.getSettings()?.enable_pdf_ticket?(console.log("\u26A0\uFE0F Fallback a impresi\xF3n PDF activado"),this.printTicketBrowser(t),{success:!0,usedThermal:!1,error:s.error}):{success:!1,usedThermal:!1,error:s.error})}catch(s){return console.error("\u274C Error al conectar con backend de impresi\xF3n:",s),this.settingsService.getSettings()?.enable_pdf_ticket?(console.log("\u26A0\uFE0F Fallback a impresi\xF3n PDF activado por error de conexi\xF3n"),this.printTicketBrowser(t),{success:!0,usedThermal:!1}):{success:!1,usedThermal:!1,error:s.error?.error||s.message||"No se pudo conectar con el servidor de impresi\xF3n"}}}printTicketBrowser(t){let s=this.settingsService.getSettings(),e=window.open("","_blank","width=300,height=600");if(!e)return;let i=this.generateTicketHtml(t,s);e.document.write(i),e.document.close(),e.onload=()=>{e.focus(),e.print(),e.close()}}generateTicketHtml(t,s){let e=this.settingsService.getDecimalFormat("total"),i=this.settingsService.getDecimalFormat("price"),a=this.settingsService.getDecimalFormat("quantity"),r=t.exchange_rate||1,g=(t.lines||[]).map(o=>{let v=o.price*r,h=o.total*r;return`
            <tr>
                <td colspan="3" class="product-name">${o.product_name}</td>
            </tr>
            <tr>
                <td>${this.currencyPipe.transform(o.units,"","",a)} x Bs. ${this.currencyPipe.transform(v,"","",i)}</td>
                <td class="text-right">Bs. ${this.currencyPipe.transform(h,"","",e)}</td>
            </tr>
        `}).join(""),u=(t.payments||[]).map(o=>{let c=o.amount_base_currency||o.total*(o.currency_id===1?1:r),v=o.bank?`<div style="font-size: 10px; margin-left: 10px;">Banco: ${o.bank}</div>`:"",h=o.reference?`<div style="font-size: 10px; margin-left: 10px;">Ref: ${o.reference}</div>`:"",E=o.cedula?`<div style="font-size: 10px; margin-left: 10px;">CI/Telf: ${o.cedula}</div>`:"";return`
            <div class="row">
                <span>${this.getPaymentMethodName(o.payment)}:</span>
                <span class="text-right">Bs. ${this.currencyPipe.transform(c,"","",e)}</span>
            </div>
            ${v}
            ${h}
            ${E}
        `}).join(""),m=this.calculateSubtotal(t)||0,n=(t.taxes||[]).reduce((o,c)=>o+(c.amount||0),0),D=this.calculateGlobalDiscountAmount(t)||0,l=t.total;(l==null||isNaN(l))&&(l=m+n-D);let f=!r||isNaN(r)?1:r,_=m*f,C=(l||0)*f;return`
            <html>
            <head>
                <style>
                    body { 
                        font-family: 'Courier New', Courier, monospace; 
                        width: 80mm; 
                        margin: 0; 
                        padding: 5mm; 
                        font-size: 12px;
                    }
                    .header { text-align: center; margin-bottom: 10px; }
                    .company-name { font-size: 16px; font-weight: bold; }
                    .info { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    table { width: 100%; border-collapse: collapse; }
                    .product-name { font-weight: bold; padding-top: 5px; }
                    .text-right { text-align: right; }
                    .totals { margin-top: 10px; border-top: 1px dashed #000; padding-top: 5px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                    .total-row { font-size: 18px; font-weight: bold; margin-top: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 10px; }
                    @media print {
                        body { width: 80mm; }
                        @page { margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <div class="company-name">${s?.company_name||"MANGOPOS"}</div>
                    <div>${s?.company_address||""}</div>
                </div>

                <div class="info">
                    <div class="row">
                        <span>Ticket #:</span>
                        <span>${t.ticket_number}</span>
                    </div>
                    <div class="row">
                        <span>Fecha:</span>
                        <span>${this.datePipe.transform(t.date,"dd/MM/yyyy HH:mm")}</span>
                    </div>
                    <div class="row">
                        <span>Cajero:</span>
                        <span>${t.cashier_name}</span>
                    </div>
                    <div class="row">
                        <span>Cliente:</span>
                        <span>${t.customer_name||"P\xFAblico General"}</span>
                    </div>
                    ${t.notes?`
                    <div style="margin-top: 5px; padding-top: 5px; border-top: 1px dotted #ccc;">
                        <strong>Nota:</strong> ${t.notes}
                    </div>`:""}
                </div>

                <table>
                    ${g}
                </table>

                <div class="totals">
                    <!--
                    <div class="row">
                        <span>Subtotal:</span>
                        <span>Bs. ${this.currencyPipe.transform(_,"","",e)}</span>
                    </div>
                    ${(t.taxes||[]).map(o=>{let c=o.amount*r;return`
                        <div class="row">
                            <span>IVA (${(o.percentage*100).toFixed(0)}%):</span>
                            <span>Bs. ${this.currencyPipe.transform(c,"","",e)}</span>
                        </div>
                    `}).join("")}
                    -->
                    ${t.globalDiscount?`
                    <div class="row" style="color: #e91e63;">
                        <span>Descuento Global:</span>
                        <span>-Bs. ${this.currencyPipe.transform(this.calculateGlobalDiscountAmount(t)*r,"","",e)}</span>
                    </div>`:""}
                    <div class="row total-row">
                        <span>TOTAL:</span>
                        <span>Bs. ${this.currencyPipe.transform(C,"","",e)}</span>
                    </div>
                </div>

                <div class="totals">
                    <strong>PAGOS:</strong>
                    ${u}
                </div>

                <div class="footer">
                    \xA1Gracias por su compra!<br>
                    MangoPOS System
                </div>
            </body>
            </html>
        `}calculateSubtotal(t){return(t.lines||[]).reduce((s,e)=>{let i=e.price;return e.discount&&(e.discount_type==="FIXED"?i=Math.max(0,e.price-e.discount):e.discount_type==="FIXED_VES"?i=Math.max(0,e.price-e.discount/t.exchange_rate):i=e.price*(1-e.discount)),s+e.units*i},0)}calculateGlobalDiscountAmount(t){if(!t.globalDiscount)return 0;if(t.globalDiscountType==="FIXED")return t.globalDiscount;if(t.globalDiscountType==="FIXED_VES")return t.globalDiscount/t.exchange_rate;let s=this.calculateSubtotal(t),e=(t.taxes||[]).reduce((i,a)=>i+a.amount,0);return(s+e)*t.globalDiscount}async printCashOpening(t){let s=this.settingsService.getSettings(),e=window.open("","_blank","width=300,height=600");if(!e)return;let i=this.generateOpeningTicketHtml(t,s);e.document.write(i),e.document.close(),e.onload=()=>{e.focus(),e.print(),e.close()}}async printCashClosing(t,s,e){let i=this.settingsService.getSettings(),a=window.open("","_blank","width=300,height=600");if(!a)return;let r=this.generateClosingTicketHtml(t,s,e,i);a.document.write(r),a.document.close(),a.onload=()=>{a.focus(),a.print(),a.close()}}generateOpeningTicketHtml(t,s){return`
            <html>
            <head>
                <style>
                    body { font-family: 'Courier New', monospace; width: 80mm; padding: 5mm; font-size: 12px; }
                    .header { text-align: center; margin-bottom: 10px; }
                    .title { font-size: 16px; font-weight: bold; margin-bottom: 5px; text-decoration: underline; }
                    .info { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 2px; }
                    .footer { text-align: center; margin-top: 30px; font-size: 10px; border-top: 1px dotted #000; padding-top: 5px; }
                    .signature { margin-top: 40px; border-top: 1px solid #000; text-align: center; width: 60%; margin-left: 20%; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div style="font-size: 16px; font-weight: bold;">${s?.company_name||"MANGOPOS"}</div>
                    <div class="title">APERTURA DE CAJA</div>
                </div>
                <div class="info">
                    <div class="row"><span>Equipo:</span> <span>${t.host}</span></div>
                    <div class="row"><span>Secuencia:</span> <span>#${t.hostsequence}</span></div>
                    <div class="row"><span>Fecha:</span> <span>${this.datePipe.transform(t.datestart,"dd/MM/yyyy HH:mm")}</span></div>
                </div>
                <div>
                    <strong>FONDOS INICIALES:</strong>
                    <div class="row"><span>Bs. (Base):</span> <span>${this.currencyPipe.transform(t.initial_balance||0,"Bs. ","symbol","1.2-2")}</span></div>
                    <div class="row"><span>USD (Alt):</span> <span>${this.currencyPipe.transform(t.initial_balance_alt||0,"$ ","symbol","1.2-2")}</span></div>
                </div>
                <div class="signature">Firma Cajero</div>
                <div class="footer">MangoPOS System</div>
            </body>
            </html>
        `}generateClosingTicketHtml(t,s,e,i){let a=this.settingsService.getDecimalFormat("total"),r=(s.payments||[]).map(n=>`
            <div class="row">
                <span>${this.getPaymentMethodName(n.payment)}</span>
                <span>
                    ${this.currencyPipe.transform(n.total,n.currency_id===1?"Bs. ":"$ ","symbol",a)}
                    ${n.currency_id===2?`<br><small style="color: #666;">(Bs. ${this.decimalPipe.transform(n.total_base,a)})</small>`:""}
                </span>
            </div>
        `).join(""),g=(s.cxcPayments||[]).map(n=>`
            <div class="row">
                <span>${this.getPaymentMethodName(n.payment)}</span>
                <span>
                    ${this.currencyPipe.transform(n.total,n.currency_id===1?"Bs. ":"$ ","symbol",a)}
                    ${n.currency_id===2?`<br><small style="color: #666;">(Bs. ${this.decimalPipe.transform(n.total_base,a)})</small>`:""}
                </span>
            </div>
        `).join(""),u=(s.movements||[]).map(n=>`
            <div class="row">
                <span>${n.movement_type==="IN"?"Entrada":"Salida"} (${n.symbol})</span>
                <span>${this.decimalPipe.transform(n.total,a)}</span>
            </div>
        `).join(""),m=e.map(n=>`
            <div class="row" style="font-weight: bold;">
                <span>${n.label}</span>
                <span>${this.decimalPipe.transform(n.amount,a)}</span>
            </div>
        `).join("");return`
            <html>
            <head>
                <style>
                    body { font-family: 'Courier New', monospace; width: 80mm; padding: 5mm; font-size: 11px; }
                    .header { text-align: center; margin-bottom: 10px; }
                    .title { font-size: 16px; font-weight: bold; margin-bottom: 5px; text-decoration: underline; }
                    .section-title { font-weight: bold; margin-top: 10px; border-bottom: 1px solid #eee; }
                    .info { margin-bottom: 10px; border-bottom: 1px dashed #000; padding-bottom: 5px; }
                    .row { display: flex; justify-content: space-between; margin-bottom: 1px; }
                    .highlight { background-color: #f0f0f0; padding: 2px 0; }
                    .footer { text-align: center; margin-top: 30px; font-size: 10px; border-top: 1px dotted #000; padding-top: 5px; }
                    .signature { margin-top: 40px; border-top: 1px solid #000; text-align: center; width: 60%; margin-left: 20%; }
                </style>
            </head>
            <body>
                <div class="header">
                    <div style="font-size: 16px; font-weight: bold;">${i?.company_name||"MANGOPOS"}</div>
                    <div class="title">CIERRE DE CAJA</div>
                </div>
                <div class="info">
                    <div class="row"><span>Equipo:</span> <span>${t.host}</span></div>
                    <div class="row"><span>Secuencia:</span> <span>#${t.hostsequence}</span></div>
                    <div class="row"><span>Apertura:</span> <span>${this.datePipe.transform(t.datestart,"dd/MM/yyyy HH:mm")}</span></div>
                    <div class="row"><span>Cierre:</span> <span>${this.datePipe.transform(new Date,"dd/MM/yyyy HH:mm")}</span></div>
                </div>

                <div class="section-title">M\xC9TRICAS DE VENTAS</div>
                ${(s.salesByCurrency||[]).map(n=>`
                    <div style="margin-top: 5px; border-bottom: 1px dotted #ccc; padding-bottom: 2px;">
                        <strong>Ventas en ${n.currency_id===1?"Bs.":"USD"}:</strong>
                        <div class="row"><span>Tickets:</span> <span>${n.ticket_count}</span></div>
                        <div class="row"><span>Subtotal:</span> <span>${this.currencyPipe.transform(n.subtotal,n.currency_id===1?"Bs. ":"$ ","symbol",a)}</span></div>
                        <div class="row"><span>Impuestos:</span> <span>${this.currencyPipe.transform(n.taxes,n.currency_id===1?"Bs. ":"$ ","symbol",a)}</span></div>
                        <div class="row"><span>Total:</span> <span>${this.currencyPipe.transform(n.total,n.currency_id===1?"Bs. ":"$ ","symbol",a)}</span></div>
                    </div>
                `).join("")}
                <div class="row highlight" style="margin-top: 5px;"><strong style="font-size: 11px;">RESUMEN TOTAL (BS.):</strong> <strong style="font-size: 11px;">${this.currencyPipe.transform(s.sales.total,"Bs. ","symbol",a)}</strong></div>

                <div class="section-title">PAGOS RECIBIDOS (Ventas)</div>
                ${r||'<div class="row"><span>Sin ventas</span></div>'}

                <div class="section-title">COBROS DE DEUDAS (CxC)</div>
                ${g||'<div class="row"><span>Sin cobros</span></div>'}


                <div class="section-title">MOVIMIENTOS DE CAJA</div>
                ${u||'<div class="row"><span>Sin movimientos</span></div>'}

                <div class="section-title">EFECTIVO ESPERADO EN CAJA</div>
                ${m}

                <div class="signature">Firma Responsable</div>
                <div class="footer">MangoPOS System</div>
            </body>
            </html>
        `}getPaymentMethodName(t){let s={CASH_MONEY:"Efectivo",cash_money:"Efectivo",cash:"Efectivo",CARD:"Tarjeta",card:"Tarjeta",TRANSFER:"Transferencia",transfer:"Transferencia",CASH_REFUND:"Devoluci\xF3n",paper:"Pago M\xF3vil",PagoMovil:"Pago M\xF3vil",PAPER:"Pago M\xF3vil",Vale:"Pago M\xF3vil",vale:"Pago M\xF3vil",debt:"Cr\xE9dito",Credito:"Cr\xE9dito"};return s[t]||s[t?.toUpperCase()]||t}static \u0275fac=function(s){return new(s||p)};static \u0275prov=b({token:p,factory:p.\u0275fac,providedIn:"root"})}return p})();export{I as a};
