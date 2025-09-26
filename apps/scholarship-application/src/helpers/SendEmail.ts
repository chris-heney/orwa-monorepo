// import { useSendEmail } from "../data/API"
// import { IRegistrationPayload, ITicketOption, IConference } from "../types/types"
// import currencyFormatter from "./currencyFormat"

// export const sendEmail = async (
//     payload: IRegistrationPayload,
//     online: string,
//     ConferenceOptions: IConference,
//     registrationSource: string,
//     TicketOptions: ITicketOption[],

// ) => {

//     const freeVendors = () => {
//         if (payload.booths.length === 1) {
//             return 2
//         } else if (payload.booths.length === 2) {
//             return 3
//         } else {
//             return 0
//         }
//     }

//     const ticketPrice = (type: 'Attendee' | 'Vendor' | 'Guest') => {
//         return (registrationSource === 'online'
//             ? TicketOptions.find((ticket) => ticket.name.includes(type))?.price_online
//             : TicketOptions.find((ticket) => ticket.name.includes(type))?.price_event) ?? 100
//     }

//     // For ticket itmes or booth items inside the current cell display them in a bullet list
//     // For the ticket items, display the name of the item and the price

//     const html = `
//     <div>
//         <h3>
//             <span class="il">Conference</span>
//             <span class="il">Registration</span> Details
//         </h3>
//         ${payload?.registrationType ? `
//         <div>
//             <label style="font-weight:800">
//                 <span class="il">Registration</span> Type </label>: ${payload?.registrationType}
//         </div>
//         ` : ''}
//         ${payload?.organization ? `
//         <div>
//             <label style="font-weight:800">Organization</label>: ${payload?.organization}
//         </div>
//         ` : ''}
//         <label style="font-weight:800">Registrant:</label>: ${payload?.registrant.first + ' ' + payload?.registrant.last}
//         </div>
//         <div>
//             <label style="font-weight:800">Phone</label>: ${payload?.registrant.phone}
//         </div>
//         <div>
//             <label style="font-weight:800">Email</label>: <a href="${payload?.registrant.email}" target="_blank">${payload?.registrant.email}</a>
//         </div>
//         <div>
//             <label style="font-weight:800">Pay By</label>: ${payload?.paymentType}
//         </div>
//         <div>
//             <label style="font-weight:800">Address</label>: 
//             ${payload.paymentData.billingAddress.address}, 
//             ${payload.paymentData.billingAddress.city}, 
//             ${payload.paymentData.billingAddress.state},
//             ${payload.paymentData.billingAddress.zip}
//         </div>

//         <hr/>

//         ${(payload.agency === 'false' && payload.memberType === 'Non Member') ? (`<div>

//         <label style="font-weight:800">Non Member Fee</label>: ${currencyFormatter.format(ConferenceOptions.non_member_fee)}

//     </div>`) : ('')}
//         ${payload?.booths && payload?.booths.length > 0 ? (`
//     <div>
//         <label style="font-weight:800">Booth Count</label>: ${payload?.booths.length}
//     </div>
//     <table cellspacing="0" cellpadding="0" style="width:100%">
//         <thead>
//             <tr style="text-align:left;background-color:#000;color:#fff">
//                 <th style="text-align:left">Booth Count</th>
//                 <th style="text-align:left">
//                     <span class="il">Registration</span> Fee
//                 </th>
//                 <th style="text-align:left">Items</th>
//             </tr>
//         </thead>
//         <tbody>
//             ${payload?.booths.map((booth, index) => `
//                 <tr style="background-color:#fff">
//                     <td style="margin-bottom:1px solid #ddd">Booth ${index + 1}</td>
//                     <td style="margin-bottom:1px solid #ddd">${
//                         index === 0 
//                         ? currencyFormatter.format(ConferenceOptions.booth_price) 
//                         : currencyFormatter.format(ConferenceOptions.booth_price_2)
//                     }</td>
//                     <td style="margin-bottom:1px solid #ddd">${booth.extras.map(
//                         extra => (`<div>- ${extra.name} ${
//                             online === 'online'
//                             ? currencyFormatter.format(extra.price_online)
//                             : currencyFormatter.format(extra.price_event)
//                         }</div>`)).join('')
//                     }</td>
//                 </tr>
//             `).join('')}
//         </tbody>
//     </table>
//     <hr>
// `) : ('')}
// ${payload.sponsors && payload.sponsors.length > 0 ? (`
// <div>
//     <label style="font-weight:800">Sponsorship Count</label>: ${payload?.sponsors.length}
// </div>
// <table cellspacing="0" cellpadding="0" style="width:100%">
//     <thead>
//         <tr style="text-align:left;background-color:#000;color:#fff">
//             <th style="text-align:left">Name</th>
//             <th style="text-align:left">
//                 <span class="il">Amount</span>
//             </th>
//         </tr>
//     </thead>
//     <tbody>
//         ${payload.sponsors.map((sponsor) => (`
//             <tr style="background-color:#fff">
//                 <td style="margin-bottom:1px solid #ddd">${sponsor.name}</td>
//                 <td style="margin-bottom:1px solid #ddd">${currencyFormatter.format(sponsor.amount)}</td>
//             </tr>
//         `)).join('')}
//     </tbody>
// </table>
// <hr>
// `) : ('')}

// ${payload?.tickets && payload?.tickets.length > 0 ? (`
// <div>
//     <label style="font-weight:800">Attendee Count</label>: ${payload?.tickets.length}
// </div>
// <table cellspacing="0" cellpadding="0" style="width:100%">
//     <thead>
//         <tr style="text-align:left;background-color:#000;color:#fff">
//         <th style="text-align:left">Attendee Name</th>
//         <th style="text-align:left">Ticket Type</th>
//         <th style="text-align:left">
//             <span class="il">Registration</span> Fee
//         </th>
//         <th style="text-align:left">Items</th>
//     </tr>
//     </thead>
//     <tbody>
//         ${payload?.tickets.map((ticket, ticketIndex) => `
//             <tr style="background-color:#fff">
//             <td style="margin-bottom:1px solid #ddd"> ${ticket.first} ${ticket.last} </td>
//             <td style = "margin-bottom:1px solid #ddd"> ${ticket.ticket_type.name} </td>
             
//                 <td style="margin-bottom:1px solid #ddd">
//                 ${ticket.type === 'Vendor'
//                 && ticketIndex + 1 <= freeVendors() ? 'Included'
//                 : currencyFormatter.format(ticketPrice(ticket.type as 'Attendee' | 'Vendor'))
//             }
//             </td>   
//                 <td style="margin-bottom:1px solid #ddd">
//                     ${ticket.extras.map(extra => `<div>- ${extra.name} ${online === 'online'
//                 ? currencyFormatter.format(extra.price_online)
//                 : currencyFormatter.format(extra.price_event)}</div>`).join('')
//             }
//                 </td>
//             </tr>
//         `).join('')}
//     </tbody>
// </table>
// <hr>
// `) : ('')}


 
// <div> Total Fee: ${currencyFormatter.format(payload.paymentData.amount)}</div>`

//     // const emailPayloadRegistrant = {
//     //     to: payload?.registrant.email,
//     //     from: 'office@orwa.org',
//     //     subject: 'Conference Registration',
//     //     html
//     // }

//     // const emailPayloadOffice = {
//     //     to: 'office@orwa.org',
//     //     from: 'website@orwa.org',
//     //     subject: 'Conference Registration',
//     //     html
//     // }

//     // useSendEmail(emailPayloadRegistrant)
//     // useSendEmail(emailPayloadOffice)

// }

