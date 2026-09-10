import React from 'react'
import { PageShell } from '../../framework/PageShell'
import { conferenceModule } from './manifest'

/**
 * @deprecated The Conference Manager is a framework page (`manifest.tsx`,
 * page `conference.dashboard`) routed by the registry. This stub only keeps
 * the `modules/dashboards.ts` re-export resolvable until the integrator
 * removes it; nothing else should import it.
 */
const Conferences = () => <PageShell page={conferenceModule.pages[0]} />

export default Conferences
