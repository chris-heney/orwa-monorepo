import React from 'react'
import { Loading, useGetList, useGetMany, useGetOne, useRecordContext } from 'react-admin'
import { YearMonthDay } from '../../../../helpers/Data'
import { ITrainingBlock, ITrainingSession, ITrainingTopic } from '../../_types'
import dayjs from 'dayjs'

// @TOOD: Import Settings from Settings Context
// @TODO: Replace with Actual Training Data
// @TODO: Finish last 20% of the form


const EventExportDeq = () => {

  const record = useRecordContext()
  const { data: eventSettings, isLoading : settingsLoading } = useGetOne('training-settings', {id : 1},)
  const { data: instructor, isLoading: instructorLoading } = useGetOne('training-instructors', { id: record.instructor },)
  const { data: instructorData, isLoading: contactLoading } = useGetOne('contacts', { id: instructor ? instructor.instructor : ''},)
  const { data: venueData, isLoading: venueLoading} = useGetList('venues', { filter: { wp_uid: record.venue_id } },)
  const venue = venueData ? venueData[0] : {}


  const { data: schedule, isLoading: scheduleLoading } = useGetList('training-schedules', {
    filter: { event: record.id.toString() }
  })
  const blockIds = schedule?.map((scheduleItem) => scheduleItem.training_schedule_blocks.map((block: ITrainingBlock) => block)).flat()
  const { data: blocks } = useGetMany('training-schedule-blocks', {
    ids: blockIds,
  }
  )
  const sessionIds = blocks?.map((blockItem) => blockItem.training_sessions.map((topic: ITrainingTopic) => topic)).flat()

  const { data: sessions } = useGetMany('training-sessions', {
    ids: sessionIds,
  })

  const topicIds = sessions?.map((sessionItem) => sessionItem.topic)

  const { data: topics } = useGetMany('training-topics', {
    ids: topicIds,
  })

  const settings = {
    office: {
      address: {
        formatted: eventSettings ? eventSettings.street + ' ' + eventSettings.city + ', ' + eventSettings.state + ' ' + eventSettings.zip : '',
        street:  eventSettings ? eventSettings.street : '',
        city: eventSettings ? eventSettings.city : '',
        state: eventSettings ? eventSettings.state: '',
        zip: eventSettings ? eventSettings.zip: '',
      },
      fax: record.phone,
      hours: '8:30am - 4:30pm',
    },
  }

  const formattedStartDate = new Date(record.start).toLocaleDateString('en-US', YearMonthDay)
  const formattedEndDate = new Date(record.end).toLocaleDateString('en-US', YearMonthDay)
  const training = {
    public: true,
    capacity: 20,
    days: [
      formattedStartDate,
      formattedEndDate
    ],
    instructor: {
      contact: {
        first: instructorData ? instructorData.first : '',
        last: instructorData ? instructorData.last : '',
        email: instructorData ? instructorData.email : '',
        phone: instructorData ? instructorData.phone : '',
      }
    },
    venue: {
      name: venue.venue_name,
      street: venue.address,
      city: venue.city,
      state: venue.province,
      zip: venue.zip
    },
    phone: record.phone,
    description: `This ${Math.ceil(blocks?.length as number / 2)} Day, ${record.hours} hour course is designed to provide entry level and intermediate water or wastewater system\n\
    operators with the necessary information needed to properly perform their job functions, as well as prepare\
    for the required DEQ examination.`,
    goals: 'To introduce students to the basic fundamentals of water or wastewater treatment and distribution.\n\
    To help students understand the various stages of water or wastewater treatment.\n\
    To introduce students to the various components of the water distribution or wastewater collection systems.\n\
    To help students understand the importance of properly operating and maintaining their systems.\n\
    To teach the students the neccessary math for operating their system.\n\
    To introduce students to the rules and regulations governing water or wastewater systems and operators.\n\
    To prepare students for taking the corresponding DEQ examinations.',
    requirements: 'Students will need to bring note pads, calculators and pencils.',
    resources: 'This course is taught directly from the DEQ Water Study Guide and the DEQ Regulations.',
    evaluation: 'Students performance is determined by the results of the certification exam'
  }

  const training_types = [
    'Class D Water Operator',
    'Class D Wastewater Operator',
    'Class C Water Operator',
    'Class C Wastewater Operator',
    'Class B Water Operator',
    'Class B Wastewater Operator',
    'Class A Water Operator',
    'Class A Wastewater Operator',
    'Class C Water Laboratory Operator',
    'Class C Wastewater Laboratory Operator',
    'Class B Water Laboratory Operator',
    'Class B Wastewater Laboratory Operator',
    'Class A Water Laboratory Operator',
    'Class A Wastewater Laboratory Operator',
  ]

  if (settingsLoading || instructorLoading || contactLoading || venueLoading || scheduleLoading) {
    return <Loading />
  }
  return (
    <div style={{ textAlign: 'left' }}>
      <h2 style={{ fontSize: '28px', textAlign: 'center', margin: 0 }}>Class Agenda</h2>
      <table width="100%" cellPadding={4} border={1} cellSpacing={0}>
        {blocks?.map((block, blockIndex) => {
          const currentDate = dayjs(record.start).add(Math.floor(blockIndex / 2) * 2, 'day')

          return (
            <>
              <thead style={{ textAlign: 'left' }}>
                {blockIndex % 2 === 0 && (
                  <tr style={{ backgroundColor: '#c7d9f1', textAlign: 'center' }}>
                    <th colSpan={3}>{currentDate.format('MMMM DD YYYY')}</th>
                  </tr>
                )}
                {blockIndex % 2 === 0 && (<tr>
                  <th>From</th>
                  <th>To</th>
                  <th>Topic</th>
                </tr>
                )}
              </thead>
              <tbody style={{ textAlign: 'left' }}>
                {block.training_sessions?.map((sessionId: number, sessionIndex: number) => {
                  const session = sessions?.find((s: ITrainingSession) => s.id === sessionId)
                  const topic = topics?.find((t: ITrainingTopic) => t.id === session?.topic)

                  return (
                    <React.Fragment key={sessionIndex}>
                      <tr>
                        <td>{dayjs(`1970-01-01 ${session.start}`).format('h:mm')} {(blockIndex + 1) % 2 === 0 ? 'PM' : 'AM'}</td>
                        <td>{dayjs(`1970-01-01 ${session.end}`).format('h:mm')} {(blockIndex + 1) % 2 === 0 ? 'PM' : 'AM'}</td>
                        <td>{topic.name}</td>
                      </tr>
                      {dayjs(session.endTime).get('minutes') !== 0 && (
                        <tr style={{ backgroundColor: '#eee' }}>
                          <td>{dayjs(`1970-01-01 ${session.end}`).format('h:mm')} {(blockIndex + 1) % 2 === 0 ? 'PM' : 'AM'}</td>
                          <td>{dayjs(`1970-01-01 ${session.end}`).add(10, 'minutes').format('h:mm')} {(blockIndex + 1) % 2 === 0 ? 'PM' : 'AM'}</td>
                          <td>Break</td>
                        </tr>
                      )}
                      {session.endTime === '12:00' && (
                        <tr style={{ backgroundColor: '#ddd' }}>
                          <td>12:00 PM</td>
                          <td>1:00 PM</td>
                          <td>Lunch Break</td>
                        </tr>
                      )}
                    </React.Fragment>
                  )
                })}
              </tbody>
            </>
          )
        })}
      </table>

      <h2>Class A & B Water Certification Training</h2>

      <table width="100%" cellPadding={0} cellSpacing={0}>
        <tr>
          <td width="50%">
            <table cellPadding={5} cellSpacing={0}>
              <tr>
                <th>Instructor</th>
                <td>
                  {training.instructor.contact.first}
                  {' '}
                  {training.instructor.contact.last}</td>
              </tr>
              <tr>
                <th>Office:</th>
                <td>{settings.office.address.formatted}</td>
              </tr>
              <tr>
                <th>Office Hours:</th>
                <td>{settings.office.hours}</td>
              </tr>
            </table>
          </td>
          <td width="50%">
            <table cellPadding={5} cellSpacing={0}>
              <tr>
                <th>Phone:</th>
                <td>{training.phone}</td>
              </tr>
              <tr>
                <th>E-mail:</th>
                <td>{training.instructor.contact.email}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <section>
        <h4 style={{ whiteSpace: 'pre-line', textDecoration: 'underline', marginBottom: 0 }}>Description:</h4>
        <p>{training.description}</p>
      </section>

      <section>
        <h4 style={{ textDecoration: 'underline', marginBottom: 0 }}>Goals:</h4>
        <p style={{ whiteSpace: 'pre-line', marginTop: 0 }}>{training.goals}</p>
      </section>

      <section>
        <h4 style={{ textDecoration: 'underline', marginBottom: 0 }}>Requirements:</h4>
        <p style={{ marginTop: 0 }}>{training.requirements}</p>
      </section>

      <section>
        <h4 style={{ textDecoration: 'underline', marginBottom: 0 }}>Resources:</h4>
        <p style={{ marginTop: 0 }}>{training.resources}</p>
      </section>

      <section>
        <h4 style={{ textDecoration: 'underline', marginBottom: 0 }}>Evaluation:</h4>
        <p style={{ marginTop: 0 }}>{training.evaluation}</p>
      </section>

      <br />
      <hr />
      <br />

      <section>

        <table width="100%">
          <tr>
            <td>
              <table>
                <tr>
                  <td width="140">Date of Request:</td>
                  <td style={{ borderBottom: '1px solid', padding: '0 5px' }}>{new Date().toLocaleString('en-US')}</td>
                </tr>
              </table>
            </td>
            <td align="right">
              <table>
                <tr>
                  <td>Class #: {record.deq_class_number}</td>
                  <td>__________________</td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <br />

        <h3>Request to Conduct DEQ Approved Standard Training Class</h3>

        <br />

        <table width="100%">
          <tr>
            <td width="150">Sponsoring Group:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>Oklahoma Rural Water Association</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="160">Approved Instructor: </td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>
              {training.instructor.contact.first}
              {' '}
              {training.instructor.contact.last}
            </td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="370">Mailing Address (for Attendance Record Forms):</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{settings.office.address.street}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="40">City:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{settings.office.address.city}</td>
            <td width="50">State:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{settings.office.address.state}</td>
            <td width="35">Zip:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{settings.office.address.zip}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="280">Telephone # (Work / Home / FAX):</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.phone} / {training.instructor.contact.phone} / {settings.office.fax}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="120">Email Address:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.instructor.contact.email}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="120">Class Location:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.venue.name}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="120">Street Address:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.venue.street}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td width="40">City:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.venue.city}</td>
            <td width="50">State:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.venue.state}</td>
            <td width="35">Zip:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.venue.zip}</td>
          </tr>
        </table>

        <br />

        {/* PUBLIC */}
        <table width="100%">
          <tr>
            <td width="450">Is this class OPEN to anyone wishing to take the class?</td>
            <td width="50" align="center" style={{ borderBottom: '1px solid' }}>{training.public ? 'X' : ''}</td>
            <td>Yes</td>
            <td width="50" align="center" style={{ borderBottom: '1px solid' }}>{training.public ? '' : 'X'}</td>
            <td>No</td>
            <td width="120">Max Students:</td>
            <td style={{ borderBottom: '1px solid', paddingLeft: '15px' }}>{training.capacity}</td>
          </tr>
        </table>

        <br />

        <table width="100%">
          <tr>
            <td colSpan={2}>Type of Class (check more than 1 if it applies):</td>
          </tr>

          <tr>
            <td>
              <table width="100%">
                {training_types.filter(type => type === (record.training_type + ' Operator')).map((type, i) => (
                  <tr key={`type-${i}`}>
                    <td align="center" width="50" style={{ borderBottom: '1px solid' }}>
                      X
                    </td>
                    <td>{type}</td>
                  </tr>
                ))}
              </table>
            </td>
          </tr>
        </table>

        <br />

        <br />

        <br />

        <br />
        Expected attendance (for Attendance Record Forms): 20

        Is an ONLINE EXAM offered? X Yes

        Date: 02 / 27 / 24 Time 3:00 PM

        Exam Location (If different from the class): Great Plains Technology Center
        Street Address: 2001 E. Gladstone City Frederick
        Cell/Pager # or direct line to classroom where exam is given: 580/614-1295

        ALL STANDARD TRAINING CLASSES AND ASSOCIATED ONLINE EXAM REQUEST FORMS MUST BE SUBMITTED

        6 WEEKS PRIOR TO THE FIRST DAY OF THE CLASS.

        Mail to: Okla. Dept. of Environmental Quality, Operator Certification, P. O. Box 1677, Oklahoma City, OK 73101-
        1677 or FAX to: 405-702-8101 or E-MAIL to: opcerttraining@deq.ok.gov

        Rev. 3/11/15
      </section>
    </div>
  )
}

export default EventExportDeq