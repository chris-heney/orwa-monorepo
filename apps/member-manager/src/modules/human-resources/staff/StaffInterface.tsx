import IAsset from '../../asset/AssetInterface'

export default interface IStaff {
    id: number
    first: string
    last: string
    email: string
    phone: string
    assets: IAsset[]
}
