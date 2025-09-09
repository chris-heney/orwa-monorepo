import { useContext } from 'react'
import { useFormContext } from 'react-hook-form'
import { ConferenceId } from '../../AppContextProvider'
import { useGetRegistrations } from '../../data/API'

const SelectRegisteredOrganization = () => {

    const { register, formState: { errors } } = useFormContext()
    const conference_id = useContext(ConferenceId)
    const {
        data: registrationOptions,
        isLoading: registrationLoading,
    } = useGetRegistrations(conference_id as string, new Date().getFullYear())

    
    const uniqueOrganizations = registrationOptions?.filter((option, index, self) =>
        index === self.findIndex((t) => (
            t.organization === option.organization
        )) 
    )

    return (!uniqueOrganizations || registrationLoading) ? <>Loading</> : (
        <div>
            <label htmlFor="organization" className="block text-sm font-semibold text-left">
                Organization <span className="font-thin italic">(select your registered organization)</span>
            </label>
            <select
                {...register('organization', { required: 'Organization is required' })}
                className='input-field text-left p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent'

            >
                <option value="">Select Organization</option>
                {uniqueOrganizations.map((option, index) => {
                    return (
                        <option key={index} value={option.organization}>
                            {option.organization}
                        </option>
                    )
                })}
            </select>

            {errors.organization && <span className="block text-red-500 text-left">*{errors.organization.message as string}</span>}
        </div>
    );
};

export default SelectRegisteredOrganization
