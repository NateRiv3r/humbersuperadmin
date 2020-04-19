export const SITETITTLE = "HumberGames";
export const USERTOKEN = "hb_token";
export const SESSION_EXPIRY = "hb_session_expiry";

export const clientID = "default";
export const waitInterval = 2; // this is the time the system can be idle before the user is logged out

export const momentFullDateFormat = "YYYY-MM-DD H:m:s";

export const primaryColor = "#6541a4";
export const secondaryColor = "#ff683c";

export const durationSelector = [
  { title: "yearly", value: "yearly" },
  { title: "monthly", value: "monthly" },
  { title: "weekly", value: "weekly" },
  { title: "daily", value: "daily" },
  { title: "one off", value: "one_off" }
];

export const genderOptions = [
  { title: "male", value: "male" },
  { title: "female", value: "female" },
  { title: "prefer not to say", value: "prefer_not_to_say" }
];

export const gameTypeSort = [
  { title: "All", value: "" },
  { title: "Number - type", value: "NUMBER" },
  { title: "Raffle - type", value: "RAFFLE" },
  { title: "Instant - mode", value: "INSTANT" },
  { title: "Scheduled - mode", value: "SCHEDULED" }
];

export const gameTypeMainSort = [
  { title: "Number", value: "0" },
  { title: "Raffle", value: "1" }
];

export const ruleTypeMainSort = [
  { title: "Any Match", value: "0" },
  { title: "Sequence", value: "1" }
];

export const ruleTypeSort = [
  { title: "All", value: "" },
  { title: "Any Match", value: "ANY_MATCH" },
  { title: "Sequence", value: "SEQUENCE" }
];

export const gameModeSort = [
  { title: "Instant", value: "0" },
  { title: "Scheduled", value: "1" }
];

export const timeSortOption = [
  { title: "All", value: "" },
  { title: "Newest first", value: "createdAt,asc" },
  { title: "Oldest first", value: "createdAt,desc" }
];

export const maritalStatusOption = [
  { title: "married", value: "married" },
  { title: "single", value: "single" },
  { title: "divorced", value: "divorced" }
];

export const countryCode = [
  { title: "+234", value: "234" },
  { title: "+41", value: "41" },
  { title: "+111", value: "111" }
];

export const sizeOptions = [
  { title: "SQM", value: "sqm" },
  { title: "SQFT", value: "sqft" }
];

export const statusMode = [
  { title: "All", value: "all" },
  { title: "Active", value: "active" },
  { title: "Inactive", value: "inactive" }
];

export const durationType = [
  { title: "Daily", value: "daily" },
  { title: "Weekly", value: "weekly" },
  { title: "Monthly", value: "monthly" }
];

export const winningRules = [
  { title: "ODDS_1_IN_100", value: "ODDS_1_IN_100" },
  { title: "ODDS_5_IN_3000", value: "ODDS_5_IN_3000" },
  { title: "ODDS_100_IN_100000", value: "ODDS_100_IN_100000" },
  { title: "ODDS_10_IN_10000", value: "ODDS_10_IN_10000" },
  { title: "ODDS_15_IN_25000", value: "ODDS_15_IN_25000" }
];

export const currencyOptions = [
  { title: "NGN", value: "NGN" },
  { title: "USD", value: "USD" },
  { title: "GBP", value: "GBP" }
];

export const propertyStatusOption = [
  { title: "All", value: "" },
  { title: "Sold", value: "sold" },
  { title: "Rented", value: "rented" },
  { title: "Pending", value: "pending" },
  { title: "Published", value: "published" },
  { title: "Unpublished", value: "unpublished" }
];

export const leaseSortOptions = [
  { title: "All lease", value: "all" },
  { title: "Active lease", value: "active" },
  { title: "Pending lease", value: "pending" },
  { title: "Annulled lease", value: "annulled" }
];

export const leaseChargeSortOptions = [
  { title: "All Charge", value: "all" },
  { title: "Paid Charge", value: "paid" },
  { title: "Pending Charge", value: "pending" }
];

export const inspectionSortOptions = [
  { title: "All", value: "all" },
  { title: "Pending", value: "pending" },
  { title: "Completed", value: "completed" },
  { title: "Failed", value: "failed" }
];
