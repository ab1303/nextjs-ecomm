import { AddressModel } from '@/models/restaurantModel';

import { Address } from '@/types';

const addressModelToAddressMap = (addressModel: AddressModel): Address => {
  return {
    addressLine: addressModel.addressLine,
    postcode: addressModel.postcode,
    state: addressModel.state,
    street_address: addressModel.streetAddress,
    suburb: addressModel.suburb,
  };
};

export default addressModelToAddressMap;
