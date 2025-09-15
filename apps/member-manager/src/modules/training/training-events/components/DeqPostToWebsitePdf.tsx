import React from 'react'
import { useGetList, useGetMany, useGetOne, useRecordContext } from 'react-admin'
import { ITrainingBlock, ITrainingSession } from '../../training-events-old/components/EventTypes'
import { ITrainingTopic } from '../../_types'
import dayjs from 'dayjs'

const RenewalAgenda: React.FC = () => {
  const record = useRecordContext()
  const { data: instructor } = useGetOne('training-instructors', { id: record.instructor },)
  const { data: instructorData } = useGetOne('contacts', { id: instructor.instructor },)


  const { data: schedule } = useGetList('training-schedules', {
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

  const startDate = new Date(record.start)
  const formattedStartDate = startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <title>Renewal Agenda</title>
        <style type="text/css">
          {`
            * {
                margin: 0;
                padding: 0;
                text-indent: 0;
            }

            h1 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 22pt;
            }

            h2 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 16pt;
            }

            h4 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 10pt;
            }

            .s1 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 8pt;
            }

            h3 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 12pt;
            }

            .s2 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 9pt;
            }

            .s3 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 9pt;
            }

            .s4 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: normal;
                text-decoration: none;
                font-size: 8pt;
                
            }

            .s5 {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: italic;
                font-weight: normal;
                text-decoration: none;
                font-size: 14pt;
            }

            .s6 {
                color: black;
                font-family: Arial, sans-serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 10pt;
            }

            p {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 14pt;
                margin: 0pt;
            }

            .a, a {
                color: black;
                font-family: "Times New Roman", serif;
                font-style: normal;
                font-weight: bold;
                text-decoration: none;
                font-size: 14pt;
            }

            table, tbody {
                vertical-align: top;
                overflow: visible;
            }
          `}
        </style>
      </head>
      <body >
        <h1 style={{ paddingTop: '3pt', textIndent: '0pt', lineHeight: '25pt', textAlign: 'center' }}>Oklahoma Rural Water Association</h1>
        <h2 style={{ textIndent: '0pt', lineHeight: '17pt', textAlign: 'center' }}>Certification Renewal Training</h2>
        <h4 style={{ textIndent: '0pt', lineHeight: '11pt', textAlign: 'center' }}>for:</h4>
        <p style={{ textIndent: '0pt', textAlign: 'left' }}></p>
        <h3 style={{ textIndent: '0pt', textAlign: 'center' }}>Operators &amp; Managers</h3>
        <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>

        <div style={{ display: 'flex', maxHeight: '100px' }}>
          <div style={{ width: '176pt', border: '1.2pt solid black', marginRight: '5px', marginBottom: '5px' }}>
            <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '2pt', textIndent: '0pt', textAlign: 'left' }}>Date: {formattedStartDate}</p>
            <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '2pt', textIndent: '0pt', textAlign: 'left' }}>
              From: {dayjs(record.start).isSame(record.end, 'day')
                ? `${formattedStartDate} - ${dayjs(record.end).format('h:mm A')}`
                : `${dayjs(record.start).format('MMMM DD')} - ${dayjs(record.end).format('MMMM DD')}`}
            </p>
            <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '2pt', textIndent: '0pt', textAlign: 'left' }}>
              Hours :<span className="s4"> {record.hours}</span>
            </p>
            <p className="s2" style={{ paddingTop: '2pt', paddingLeft: '2pt', textIndent: '0pt', textAlign: 'left' }}>
              Instructor: <span className="s3">{instructorData.first + ' ' + instructorData.last}</span>
            </p>
          </div>

          <div style={{ width: '176pt', border: '1.2pt solid black', marginBottom: '5px' }}>
            <p className="s2" style={{ paddingTop: '3pt', paddingLeft: '4pt', textIndent: '0pt', textAlign: 'left' }}>{record.address.street} , {record.address.city}</p>
            <p className="s2" style={{ paddingTop: '1pt', paddingLeft: '4pt', textIndent: '0pt', lineHeight: '115%', textAlign: 'left' }}>{record.address.state} , {record.address.zip}</p>
          </div>

          <div style={{ width: '176pt', border: '1.2pt solid black', marginBottom: '5px', marginLeft: '5px' }}>
            <p className="s5" style={{ paddingTop: '3pt', textIndent: '0pt', textAlign: 'center' }}>For Official Use Only:</p>
            <table>
              <tr style={{ height: '11pt' }}>
                <td style={{ paddingLeft: '20pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>
                  <p className="s1"  >Persons Attended:</p>
                </td>
                <td style={{ width: '45pt', border: '1.2pt solid black' }}>
                  <p className="s1" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>20</p>
                </td>

              </tr>
              <tr style={{ height: '11pt' }}>
                <td style={{ paddingLeft: '20pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>
                  <p className="s1"  >Systems Attended:</p>
                </td>
                <td style={{ width: '45pt', border: '1.2pt solid black' }}>
                  <p className="s1" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>20</p>
                </td>
              </tr>
              <tr style={{ height: '11pt' }}>
                <td style={{ paddingLeft: '20pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>
                  <p className="s1"  >Program:</p>
                </td>
                <td style={{ width: '45pt', border: '1.2pt solid black' }}>
                  <p className="s1" style={{ paddingLeft: '1pt', textIndent: '0pt', lineHeight: '9pt', textAlign: 'left' }}>DEQ</p>
                </td>
              </tr>
            </table>
          </div>
        </div>

        <table style={{ borderCollapse: 'collapse' }} cellSpacing="0">
          <tr style={{ height: '15pt' }}>
            <td style={{ width: '51pt', border: '1.2pt solid black' }}>
              <p className="s6" style={{ paddingTop: '1pt', paddingLeft: '3pt', textIndent: '0pt', textAlign: 'left' }}>Time</p>
            </td>
            <td style={{ width: '153pt', border: '1.2pt solid black' }}>
              <p className="s6" style={{ paddingTop: '1pt', paddingLeft: '3pt', textIndent: '0pt', textAlign: 'left' }}>Topic</p>
            </td>
            <td style={{ width: '324pt', border: '1.2pt solid black' }}>
              <p className="s6" style={{ paddingTop: '1pt', paddingLeft: '3pt', textIndent: '0pt', textAlign: 'left' }}>Learning Objectives</p>
            </td>
          </tr>
          {blocks?.map((block) => (
            block.training_sessions?.map((sessionId: number, sessionIndex: number) => {
              const session = sessions?.find((s: ITrainingSession) => s.id === sessionId)
              const topic = topics?.find((t: ITrainingTopic) => t.id === session?.topic)
              const start = dayjs(`1970-01-01 ${session.start}`).format('h:mm')

              return (
                <tr key={sessionIndex} style={{ height: '29pt' }}>
                  <td style={{ width: '51pt', border: '1.2pt solid black' }}>
                    <p className="s2" style={{ paddingLeft: '3pt', textIndent: '0pt', textAlign: 'left' }}>{start} {block.am_pm}</p>
                  </td>
                  <td style={{ width: '153pt', border: '1.2pt solid black' }}>
                    <p className="s2" style={{ paddingLeft: '4pt', textIndent: '0pt', textAlign: 'left' }}>{topic?.name}</p>
                  </td>
                  <td style={{ width: '324pt', border: '1.2pt solid black' }}>
                    <p className="s3" style={{ paddingLeft: '3pt', textIndent: '0pt', textAlign: 'left' }}>{topic?.description}</p>
                  </td>
                </tr>
              )
            })
          ))}
          <tr style={{ height: '44pt' }}>
            <td style={{ width: '528pt', border: '1.2pt solid black' }} colSpan={3}>
              <p className="s6" style={{ paddingTop: '4pt', paddingLeft: '6pt', textIndent: '0pt', textAlign: 'left' }}>Notes: {record.public_notes}</p>
            </td>
          </tr>
        </table>
        <p style={{ textIndent: '0pt', textAlign: 'left' }}><br /></p>
        <p style={{ textIndent: '0pt', textAlign: 'center' }}>
          <a href="http://www.orwa.org/" rel="noreferrer" className="a" target="_blank">Contact us at (405) 672-8925 or visit our website at </a>
          <a href="http://www.orwa.org/" rel="noreferrer" target="_blank">www.orwa.org</a>
        </p>
      </body>
    </html>
  )
}

export default RenewalAgenda
