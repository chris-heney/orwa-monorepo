/**
 * A set of functions called "actions" for `conference-notification`
 */

export default ({ strapi }) => {

  return {

    resendNotification: async (ctx) => {
      // I need registrationId and conferenceId
      const { registrationId, conferenceId } = ctx.request.body

      try {
        const registration = await strapi.documents('api::conference-registration.conference-registration').findOne({
            documentId: "__TODO__",
            populate: '*'
        })

        const attendeeIds = registration.attendees.map(attendee => attendee.id)
        const boothIds = registration.booths.map(booth => booth.id)
        const sponsorshipIds = registration.sponsorships.map(sponsorship => sponsorship.id)

        const attendees = await strapi.documents('api::conference-attendee.conference-attendee').findMany({
          populate: '*',
          filters: { id: attendeeIds }
        })

        const booths = await strapi.documents('api::conference-booth.conference-booth').findMany({
          populate: '*',
          filters: { id: boothIds }
        })

        const sponsorships = await strapi.documents('api::conference-sponsorship.conference-sponsorship').findMany({
          populate: '*',
          filters: { id: sponsorshipIds }
        })

        const ticketOptions = await strapi.documents('api::conference-ticket.conference-ticket').findMany({
          populate: '*',
          filters: { conferences: conferenceId }
        })

        const conferenceData = await strapi.documents('api::conference.conference').findOne({
            documentId: "__TODO__",
            populate: '*'
        })

        const freeVendors = () => {
          if (registration.booths.length === 1) {
            return 2
          } else if (registration.booths.length === 2) {
            return 3
          } else {
            return 0
          }
        }

        const currencyFormatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        })


        const ticketPrice = (type: 'Attendee' | 'Vendor' | 'Guest') => {
          return ticketOptions.find((ticket) => ticket.name.includes(type))?.price_online
        }

        // For ticket itmes or booth items inside the current cell display them in a bullet list
        // For the ticket items, display the name of the item and the price

        const YearMonthDay: Intl.DateTimeFormatOptions = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour12: true,
        }

        const createdAt = new Date(registration.createdAt).toLocaleDateString('en-US', YearMonthDay)

        const html = `
    <div>
        <h3>
            <span class="il">Conference</span>
            <span class="il">Registration</span> Details
        </h3>
        <div>
            <label style="font-weight:800">
                <span class="il">Registration Source </span> </label>: ${registration.registration_source.charAt(0).toUpperCase() + registration.registration_source.slice(1)}
        </div>
        <div>
            <label style="font-weight:800">
                <span class="il">Submission </span> Date </label>: ${createdAt}
        </div>
        ${registration.type ? `
        <div>
            <label style="font-weight:800">
                <span class="il">Registration</span> Type </label>: ${registration.type}
        </div>
        ` : ''}
        ${registration.organization ? `
        <div>
            <label style="font-weight:800">Organization</label>: ${registration.organization}
        </div>
        ` : ''}
        <label style="font-weight:800">Registrant:</label>: ${registration.registrant.first + ' ' + registration.registrant.last}
        </div>
        <div>
            <label style="font-weight:800">Phone</label>: ${registration.registrant.phone}
        </div>
        <div>
            <label style="font-weight:800">Email</label>: <a href="${registration.registrant.email}" target="_blank">${registration.registrant.email}</a>
        </div>
        <div>
            <label style="font-weight:800">Pay By</label>: ${registration.payment_method}
        </div>
        ${registration.address ? (`<div>
            <label style="font-weight:800">Address</label>: 
            ${registration.address.street}, 
            ${registration.address.city}, 
            ${registration.address.state},
            ${registration.address.zip}
        </div>`) : ('')}

        <hr/>

        ${registration.non_member_fee ? (`<div>

        <label style="font-weight:800">Non Member Fee</label>: ${currencyFormatter.format(conferenceData.non_member_fee)}

    </div>`) : ('')}

    ${registration.items && registration.items.length > 0 ? (`
    <div>
        <label style="font-weight:800">Registration Extras</label>: ${registration.items.length}
    </div>
    <table cellspacing="0" cellpadding="0" style="width:100%">
        <thead>
            <tr style="text-align:left;background-color:#000;color:#fff">
                <th style="text-align:left">Item</th>
                <th style="text-align:left">
                    <span class="il">Fee</span> 
                </th>
            </tr>
        </thead>
        <tbody>
            ${registration.items.map((extra) => `
                <tr style="background-color:#fff">
                    <td style="margin-bottom:1px solid #ddd">${extra.label}</td>
                    <td style="margin-bottom:1px solid #ddd">
                   ${currencyFormatter.format(extra.value)}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <hr>
`) : ('')}
        ${(booths && booths.length > 0) ? (`
    <div>
        <label style="font-weight:800">Booth Count</label>: ${booths.length}
    </div>
    <table cellspacing="0" cellpadding="0" style="width:100%">
        <thead>
            <tr style="text-align:left;background-color:#000;color:#fff">
                <th style="text-align:left">Booth Count</th>
                <th style="text-align:left">
                    <span class="il">Registration</span> Fee
                </th>
                <th style="text-align:left">Items</th>
            </tr>
        </thead>
        <tbody>
            ${booths.map((booth, index) => `
                <tr style="background-color:#fff">
                    <td style="margin-bottom:1px solid #ddd">Booth ${index + 1}</td>
                    <td style="margin-bottom:1px solid #ddd">${index === 0
              ? currencyFormatter.format(conferenceData.booth_price)
              : currencyFormatter.format(conferenceData.booth_price_2)
            }</td>
                    <td style="margin-bottom:1px solid #ddd">${booth.items.map(
              item => (`<div>- ${item.label} ${currencyFormatter.format(item.value)}</div>`)).join('')
            }</td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <hr>
`) : ('')}
${(sponsorships && sponsorships.length > 0) ? (`
<div>
    <label style="font-weight:800">Sponsorship Count</label>: ${sponsorships.length}
</div>
<table cellspacing="0" cellpadding="0" style="width:100%">
    <thead>
        <tr style="text-align:left;background-color:#000;color:#fff">
            <th style="text-align:left">Name</th>
            <th style="text-align:left">
                <span class="il">Amount</span>
            </th>
        </tr>
    </thead>
    <tbody>
        ${sponsorships.map((sponsor) => (`
            <tr style="background-color:#fff">
                <td style="margin-bottom:1px solid #ddd">${sponsor.name}</td>
                <td style="margin-bottom:1px solid #ddd">${currencyFormatter.format(sponsor.amount)}</td>
            </tr>
        `)).join('')}
    </tbody>
</table>
<hr>
`) : ('')}

${(attendees && attendees.length > 0) ? (`
<div>
    <label style="font-weight:800">Attendee Count</label>: ${attendees.length}
</div>
<table cellspacing="0" cellpadding="0" style="width:100%">
    <thead>
        <tr style="text-align:left;background-color:#000;color:#fff">
        <th style="text-align:left">Attendee Name</th>
        <th style="text-align:left">Ticket Type</th>
        <th style="text-align:left">
            <span class="il">Registration</span> Fee
        </th>
        <th style="text-align:left">Items</th>
    </tr>
    </thead>
    <tbody>
        ${attendees.map((attendee, ticketIndex) => `
            <tr style="background-color:#fff">
            <td style="margin-bottom:1px solid #ddd"> ${attendee.first} ${attendee.last} </td>
            <td style = "margin-bottom:1px solid #ddd"> ${attendee.type} </td>
             
                <td style="margin-bottom:1px solid #ddd">
                ${attendee.type === 'Vendor'
                && ticketIndex + 1 <= freeVendors() ? 'Included'
                : currencyFormatter.format(ticketPrice(attendee.type as 'Attendee' | 'Vendor'))
              }
                     </td>   
                            <td style="margin-bottom:1px solid #ddd">
                                ${attendee.items.map(item => `<div>- ${item.label} ${currencyFormatter.format(item.value)}</div>`).join('')
              }
                    </td>
                </tr>
            `).join('')}
        </tbody>
    </table>
    <hr>
`) : ('')}
  <div> Total Fee: ${currencyFormatter.format(registration.total)}</div>
`

        const emailPayloadOffice = {
          to: 'office@orwa.org',
          from: 'website@orwa.org',
          subject: 'Conference Registration',
          html
        }

        const myEmailPayload = {
          to: 'marcosje2005@gmail.com',
          from: 'website@orwa.org',
          subject: 'Conference Registration',
          html
        }

        const email1 = await strapi.plugins['email'].services.email.send(emailPayloadOffice)
        const email2 = await strapi.plugins['email'].services.email.send(myEmailPayload)

        if (email1 && email2) {
          return ctx.body = {
            result: 'success'
          }
        } else {
          return ctx.body = {
            result: 'Error',
            error: 'Email not sent'
          }
        }

      } catch (err) {
        return ctx.body = {
          result: 'Error',
          error: err.message
        }
      }
    }
  };
}
