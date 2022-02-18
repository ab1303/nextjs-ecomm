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

const addressToAddressModelMap = (addressModel: Address): AddressModel => {
  return {
    addressLine: addressModel.addressLine,
    postcode: addressModel.postcode,
    state: addressModel.state,
    streetAddress: addressModel.street_address,
    suburb: addressModel.suburb,
  };
};

export { addressModelToAddressMap, addressToAddressModelMap };
