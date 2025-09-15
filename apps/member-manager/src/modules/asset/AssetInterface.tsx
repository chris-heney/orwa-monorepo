export default interface IAsset {
    name: string
    description: string
    category: 'Camera'
    | 'Camera Drone'
    | 'Camera Video'
    | 'Copier'
    | 'Display Monitor'
    | 'Display Projector'
    | 'Display Projector Screen'
    | 'Display Television'
    | 'Display Wifi Module'
    | 'Equipment Drone'
    | 'Equipment Measurement'
    | 'Equipment Test'
    | 'Network Hardware'
    | 'PC Desktop'
    | 'PC Embedded'
    | 'PC Group Tote'
    | 'PC Laptop'
    | 'PC Tablet'
    | 'PC Workstation'
    | 'Phone Hotspot'
    | 'Phone KSU Hardware'
    | 'Phone Smart'
    | 'Printer'
    | 'Printer AIO'
    | 'Printer Fax'
    | 'Printer LGF'
    | 'Printer Mobile'
    | 'Printer Postage'
    | 'Printer Tag'
    | 'Security Hardware'
    | 'Signage Conference'
    | 'Signage State Event'
    | 'Software Management'
    | 'Software OS'
    | 'Software Productivity'
    | 'Tool'
    | 'Tool Fixed'
    | 'Tool Set'
    | 'Vehicle Gator'
    | 'Vehicle Mower'
    | 'Vehicle Trailer'
    | 'Vehicle Truck'
    make: string
    model: string
    serial_number: string
    tangible: boolean
    value: number
    sub_assets: IAsset
}
