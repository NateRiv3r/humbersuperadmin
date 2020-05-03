import React, { useEffect, useState } from "react";
import FormGroup from "../formGroup/formGroup";
import Input from "../input/Input";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { formatAddress, getActiveAddress } from "../../utils/helper";
import { Select } from "../select/Select";
import "../../pages/propertyListing/propertyListing.css";

function AddressController(props) {
  const [addressData, setAddressData] = useState({});
  const [fullAddress, setFullAddress] = useState([]);
  const [addressList, setAddressList] = useState([]);

  const changeAddress = e => {
    setAddressData({
      ...addressData,
      [e.target.name]: e.target.value
    });
    if (props.onChange) {
      props.onChange(addressData);
    }
  };

  useEffect(() => {
    if (props.addressData) {
      setAddressData(props.addressData);
    }
  }, [props.addressData]);

  const onChangeAuto = e => {
    const activeAddress = fullAddress.filter(
      item => item.place_id === e.target.value
    );
    const formattedAddress = formatAddress(activeAddress);
    setAddressData(formattedAddress);
    if (props.onChange) {
      props.onChange(formattedAddress);
    }
  };

  const addressResolved = e => {
    setFullAddress(e);
    let newList = e.map(item => {
      return {
        title: item.formatted_address,
        value: item.place_id
      };
    });
    setAddressList(newList);
  };

  useEffect(() => {
    geocodeByAddress(addressData.address)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        getActiveAddress(latLng.lat, latLng.lng, addressResolved)
      );
  }, [addressData.address]);

  return (
    <div className="grid grid-2 grid-gap">
      <div
        data-aos={!props.disableAnim && "fade-up"}
        data-aos-delay="300"
        data-aos-anchor="snchor"
      >
        <FormGroup
          label="Address"
          subLabel={!props.edit && "Don’t worry, your address is safe with us."}
        >
          <Select
            placeholder="Eg. 21 folakemi street"
            name="address"
            optionList={addressList}
            value={addressData.address}
            autoComplete
            onChange={onChangeAuto}
            required
            onTypeChange={changeAddress}
          />
        </FormGroup>
      </div>
      <div
        data-aos={!props.disableAnim && "fade-up"}
        data-aos-delay="500"
        data-aos-anchor="snchor"
      >
        <FormGroup
          label="City"
          subLabel={
            !props.edit &&
            "Not so certain of the word here! Your town can be a CITY too."
          }
        >
          <Input
            placeholder="Eg. Ikoyi"
            value={addressData.city}
            name="city"
            required
            onChange={changeAddress}
          />
        </FormGroup>
      </div>

      <div
        data-aos={!props.disableAnim && "fade-up"}
        data-aos-delay="700"
        data-aos-anchor="snchor"
      >
        <FormGroup
          label="State"
          subLabel={
            !props.edit && "Your region or province can be a STATE too."
          }
        >
          <Input
            placeholder="Eg. Kaduna"
            value={addressData.state}
            name="state"
            required
            onChange={changeAddress}
          />
        </FormGroup>
      </div>

      <div
        data-aos={!props.disableAnim && "fade-up"}
        data-aos-delay="900"
        data-aos-anchor="snchor"
      >
        <FormGroup
          label="Country"
          subLabel={
            !props.edit && "We believe we all have a country. Just kidding."
          }
        >
          <Input
            placeholder="Eg. Nigeria"
            value={addressData.country}
            name="country"
            required
            onChange={changeAddress}
          />
        </FormGroup>
      </div>
    </div>
  );
}

export function SingleAddress(props) {
  const [addressData, setAddressData] = useState(props.value);
  const [fullAddress, setFullAddress] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const changeAddress = e => {
    setAddressData(e.target.value);
    if (props.onValueChange) {
      props.onValueChange({
        target: {
          name: props.name,
          value: e.target.value
        }
      });
    }
  };

  const onChangeAuto = e => {
    const activeAddress = fullAddress.filter(
      item => item.place_id === e.target.value
    );
    setAddressData(activeAddress[0].formatted_address);

    if (props.onValueChange) {
      props.onValueChange({
        target: {
          name: props.name,
          value: activeAddress[0].formatted_address
        }
      });
    }
  };

  const addressResolved = e => {
    setFullAddress(e);
    let newList = e.map(item => {
      return {
        title: item.formatted_address,
        value: item.place_id
      };
    });
    setAddressList(newList);
  };

  useEffect(() => {
    geocodeByAddress(addressData)
      .then(results => getLatLng(results[0]))
      .then(latLng =>
        getActiveAddress(latLng.lat, latLng.lng, addressResolved)
      );
  }, [addressData]);
  return (
    <Select
      placeholder="Eg. 21 folakemi street, lagos"
      name={props.name || "kin_address"}
      optionList={addressList}
      value={addressData}
      autoComplete
      onChange={onChangeAuto}
      required
      onTypeChange={changeAddress}
    />
  );
}

export default AddressController;
