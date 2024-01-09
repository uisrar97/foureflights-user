import moment from "moment";
import {
  ValidateEmail,
  getMonthNum,
  days_between,
} from "../../../helper/ConvertFunctions";

export default function validateInfo(
  email,
  phone,
  title,
  fname,
  lname,
  nationality,
  dob_day,
  dob_month,
  dob_year,
  searchQuery,
  cnic,
  passport_number,
  exp_day,
  exp_month,
  exp_year,
  btnState
) {
  let errors = {};
  let emailCheck;

  if (email.length === 0) {
    errors.email = "Email is Required";
  } else {
    emailCheck = ValidateEmail(email);
    if (!emailCheck) {
      errors.email = "Email is not Valid";
    } else if (emailCheck && errors.email) {
      delete errors.email;
    }
  }

  if (phone === "" || phone.length > 0) {
    if (phone.length > 0) {
      if (phone.match(/[^ _-]/g).length < 11) {
        errors.phone = "Contact number is not Valid";
      }
      if (phone.match(/[^ _-]/g).length === 11 && errors.phone) {
        delete errors.phone;
      }
    } else {
      errors.phone = "Contact number is Required";
    }
  }

  if (title === "") {
    errors.title = "Title is Required";
  } else {
    delete errors.title;
  }

  if (fname === "" || fname.length === 0) {
    errors.fname = "First Name is Required";
  } else {
    delete errors.fname;
  }

  if (lname === "" || lname.length === 0) {
    errors.lname = "Last Name is Required";
  } else {
    delete errors.lname;
  }

  if (nationality.value === "") {
    errors.nationality = "Nationality is Required";
  } else {
    delete errors.nationality;
  }

  if (
    typeof dob_day.value === "undefined" &&
    typeof dob_month.value === "undefined" &&
    typeof dob_year.value === "undefined"
  ) {
    errors.dob = "Date of Birth is Required.";
  } else {
    if (
      typeof dob_day.value === "undefined" ||
      typeof dob_month.value === "undefined" ||
      typeof dob_year.value === "undefined"
    ) {
      errors.dob = "Date of Birth is Incomplete.";
    } else {
      if (
        typeof dob_day.value !== "undefined" &&
        typeof dob_month.value !== "undefined" &&
        typeof dob_year.value !== "undefined"
      ) {
        let month = getMonthNum(dob_month.value);
        const date = `${month}/${dob_day.value}/${dob_year.value}`;
        const validity = moment(date, "MM/DD/YYYY", true).isValid();

        if (validity) {
          let age = Math.round(
            days_between(
              new Date(`${dob_month.value}-${dob_day.value}-${dob_year.value}`),
              new Date(searchQuery)
            )
          );

          // if(age < 6574) // For 18 Years Age
          if (age < 4383) {
            // For 12 Years Age
            // errors.age = 'Adult Age Must Be Above 18 Years';
            errors.dob = "Adult Age Must Be 12 Years and Above";
          } else {
            delete errors.dob;
          }
        } else {
          errors.dob = "Date of Birth is Invalid";
        }
      }
    }
  }

  if (!cnic || cnic === "_____-_______-_") {
    errors.cnic = "CNIC Number Is Required";
  } else if (
    cnic &&
    cnic.match(/[^ _-]/g) !== null &&
    cnic.match(/[^ _-]/g).length < 13
  ) {
    errors.cnic = "Provide Complete CNIC Number";
  }

  if (
    nationality.value !== undefined &&
    nationality.value !== "PK" &&
    nationality.value !== ""
  ) {
    delete errors.cnic;
    if (
      passport_number !== "" &&
      passport_number !== "_________" &&
      passport_number.length > 0
    ) {
      if (passport_number.match(/[^ _-]/g).length < 5) {
        errors.passport = "Provide Complete Passport Number";
      } else {
        let hasOnlyLtr = /^[a-zA-Z]+$/;
        let hasOnlyNmbr = /^[0-9]+$/;
        let firstTwo = String(passport_number.match(/[^ _-]/g))
          .replaceAll(",", "")
          .slice(0, 2);
        let lastSeven = String(passport_number.match(/[^ _-]/g))
          .replaceAll(",", "")
          .slice(2);

        if (
          hasOnlyLtr.test(firstTwo) === false ||
          hasOnlyNmbr.test(lastSeven) === false
        ) {
          errors.passport = "Valid Passport Number format is AA9999999";
        } else {
          delete errors.passport;
        }
      }
    } else {
      errors.passport = "Passport Number is Required";
    }

    if (
      typeof exp_day.value === "undefined" &&
      typeof exp_month.value === "undefined" &&
      typeof exp_year.value === "undefined"
    ) {
      errors.passExp = "Passport Expiry is Required.";
    } else {
      if (
        typeof exp_day.value === "undefined" ||
        typeof exp_month.value === "undefined" ||
        typeof exp_year.value === "undefined"
      ) {
        errors.passExp = "Passport Expiry Date is Incomplete.";
      } else {
        if (
          typeof exp_day.value !== "undefined" &&
          typeof exp_month.value !== "undefined" &&
          typeof exp_year.value !== "undefined"
        ) {
          let month = getMonthNum(exp_month.value);
          const date = `${month}/${exp_day.value}/${exp_year.value}`;
          const validity = moment(date, "MM/DD/YYYY", true).isValid();
          const convDate = new Date(date);
          const currDate = new Date();

          if (validity && convDate <= currDate) {
            errors.passExp = "Passport Has Been Expired";
          } else if (!validity) {
            errors.passExp = "Expiry Date is Invalid";
          } else {
            delete errors.passExp;
          }
        } else {
          errors.passExp = "Passport Expiry is Required";
        }
      }
    }
  }

  if (Object.keys(errors).length > 0) {
    btnState(false);
  } else {
    btnState(true);
  }

  return errors;
}
