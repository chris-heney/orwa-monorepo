const getAddressURI = ( address: string ): string => {
  return address.replace(
    / /g, '+'
  ).replace(
    /,,/g,
    ','
  ).replace(
    /\+\+/g,
    '+'
  ).replace(
    /null/g,
    ''
  ); 
}

export default getAddressURI