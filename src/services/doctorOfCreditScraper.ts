const axios = require("axios");
const jsdom = require("jsdom");
const fs = require("fs");
// const { delay } = require("../utils/generic.utils");

const delay = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

const { JSDOM } = jsdom;

const BONUSES_URL: string = "https://www.doctorofcredit.com/best-bank-account-bonuses";

type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "BUSINESS"
  | "STATE_SPECIFIC"
  | "REGION_OR_BRANCH_SPECIFIC";

const ACCOUNT_TYPES: Record<AccountType, AccountType> = {
  CHECKING: "CHECKING",
  SAVINGS: "SAVINGS",
  BUSINESS: "BUSINESS",
  STATE_SPECIFIC: "STATE_SPECIFIC",
  REGION_OR_BRANCH_SPECIFIC: "REGION_OR_BRANCH_SPECIFIC",
};

type State =
  | "AL"
  | "AK"
  | "AZ"
  | "AR"
  | "CA"
  | "CO"
  | "CT"
  | "DE"
  | "FL"
  | "GA"
  | "HI"
  | "ID"
  | "IL"
  | "IN"
  | "IA"
  | "KS"
  | "KY"
  | "LA"
  | "ME"
  | "MD"
  | "MA"
  | "MI"
  | "MN"
  | "MS"
  | "MO"
  | "MT"
  | "NE"
  | "NV"
  | "NH"
  | "NJ"
  | "NM"
  | "NY"
  | "NC"
  | "ND"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VT"
  | "VA"
  | "WA"
  | "WV"
  | "WI"
  | "WY";

const STATES: Record<State, State> = {
  AL: "AL",
  AK: "AK",
  AZ: "AZ",
  AR: "AR",
  CA: "CA",
  CO: "CO",
  CT: "CT",
  DE: "DE",
  FL: "FL",
  GA: "GA",
  HI: "HI",
  ID: "ID",
  IL: "IL",
  IN: "IN",
  IA: "IA",
  KS: "KS",
  KY: "KY",
  LA: "LA",
  ME: "ME",
  MD: "MD",
  MA: "MA",
  MI: "MI",
  MN: "MN",
  MS: "MS",
  MO: "MO",
  MT: "MT",
  NE: "NE",
  NV: "NV",
  NH: "NH",
  NJ: "NJ",
  NM: "NM",
  NY: "NY",
  NC: "NC",
  ND: "ND",
  OH: "OH",
  OK: "OK",
  OR: "OR",
  PA: "PA",
  RI: "RI",
  SC: "SC",
  SD: "SD",
  TN: "TN",
  TX: "TX",
  UT: "UT",
  VT: "VT",
  VA: "VA",
  WA: "WA",
  WV: "WV",
  WI: "WI",
  WY: "WY",
};

const UNKNOWN = "UNKNOWN";
type Unknown = string;

const scrape = async () => {
  const response = await axios({ method: "get", url: BONUSES_URL });
  const { document } = new JSDOM(response.data).window;

  const [
    checkingSection,
    savingsSection,
    businessSection,
    stateSpecificSection,
    regionOrBranchSpecificSection,
  ] = getSections(document);
  // console.log(checkingSection);
  const checkingOffers = await buildOffers(document, checkingSection, ACCOUNT_TYPES.CHECKING);
  const savingsOffers = await buildOffers(document, savingsSection, ACCOUNT_TYPES.SAVINGS);
  const businessOffers = await buildOffers(document, businessSection, ACCOUNT_TYPES.BUSINESS);
  const stateSpecificOffers = await buildOffers(
    document,
    stateSpecificSection,
    ACCOUNT_TYPES.STATE_SPECIFIC
  );
  const regionOrBranchSpecificOffers = await buildOffers(
    document,
    regionOrBranchSpecificSection,
    ACCOUNT_TYPES.REGION_OR_BRANCH_SPECIFIC
  );

  const offers = [
    ...checkingOffers,
    ...savingsOffers,
    ...businessOffers,
    ...stateSpecificOffers,
    ...regionOrBranchSpecificOffers,
  ];
  // offers.map(offer => {
  //   offer.
  // })

  const outputFilename = "results.json";

  fs.writeFile(outputFilename, JSON.stringify(offers, null, 4), (err: Error) => {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFilename);
    }
  });

  // checkingOffers.

  // console.log(checkingOffers);
};

// function Log(title: string, value: any) {
//   // title: String;
//   this.title = title;
//   this.value = value;
// }

class Log {
  title: string;
  value: any;

  constructor(title: string, value: any) {
    this.title = title;
    this.value = value;
  }
}

// const parseReviewPage = async (reviewUrl: string | null) => {
const parseReviewPage = async (offer: any) => {
  if ((offer.details?.reviewUrl ?? null) === null) return;

  const response = await axios({ method: "get", url: offer.details.reviewUrl });
  const { document } = new JSDOM(response.data).window;

  const bullets = [...document.querySelector("#toc_container").previousElementSibling.children];

  return bullets.reduce((acc, li) => {
    const text = li.textContent.toLowerCase();

    if (isMaxBonusAmount(text)) {
      acc.maxBonusAmount = getMaxBonusAmount(text);
      // console.table(new Log(offer.title, text));
    } else if (isAvailability(text)) {
      // acc.availability = {
      //   description: text,
      // };
    } else if (isCreditPull(text)) {
      // acc.creditPullType = getCreditFunding(text);
    } else if (isChexSystems(text)) {
      // acc.isChexSystems = getisChexSystems(text);
    }
  }, {});
};

const getSections = (document: any) => {
  return Object.values(
    [...document.querySelectorAll(".toc_list > li")].slice(0, -1).reduce((acc, el) => {
      const title = el.querySelector("a").textContent;
      const ids = [...el.querySelectorAll("ul li a")]
        .slice(1)
        .map(({ href }) => href.slice(href.indexOf("#") + 1));

      return { ...acc, [title]: { title, ids } };
    }, {})
  );
};

const parseBullets = (bullets: any[]) => {
  return bullets.reduce((acc, li) => {
    const text = li.textContent.toLowerCase();

    if (isPostReview(text)) {
      acc.reviewUrl = li?.querySelector?.("a")?.href ?? null;
    } else if (isCreditPull(text)) {
      acc.creditPullType = getCreditPullType(text);
    } else if (isCreditFunding(text)) {
      acc.creditFunding = getCreditFunding(text);
    } else if (isDirectDeposit(text)) {
      acc.directDepositDetails = text;
    }

    return acc;
  }, {});
};

const parseOverview = (document: any, id: string, accountType: AccountType) => {
  let cursor = document.querySelector(`[id='${id}']`).parentElement;
  const title = cursor.textContent;
  cursor = cursor.nextElementSibling;
  const directLinkToOffer = cursor?.querySelector?.("a")?.href ?? null;
  cursor = cursor.nextElementSibling;
  const description = cursor.textContent;
  cursor = cursor.nextElementSibling;
  const details = parseBullets([...cursor.children]);

  return { title, accountType, directLinkToOffer, description, ...details };
};

// Affinity_Federal_Credit_Union_100_Referral_Bonus
const buildOffers = async (document: any, section: any, accountType: AccountType) => {
  const offers = section.ids.map((id: string) => parseOverview(document, id, accountType));

  // console.log(offers);

  const offersWithAdditionalDetails = await Promise.allSettled(
    offers.map(async (offer: any, idx: number) => {
      try {
        await delay(idx * 50);
        // console.log(`parsing: ${offer.title}`);
        const additionalDetails = await parseReviewPage(offer);
        return { ...offer, ...additionalDetails };
      } catch (err) {
        console.log(`Failed to parse additional details for: ${offer.title}`, err);
      }
    })
  );

  console.log("offersWithAdditionalDetails:", offersWithAdditionalDetails.length);

  return offersWithAdditionalDetails;
};

const getisChexSystems = (text: string): boolean | null => {
  if (text.includes("yes")) return true;
  if (text.includes("no")) return false;
  return null;
};

const getMaxBonusAmount = (text: string): number => {
  const formattedDollarValue = text.slice(text.indexOf("$") + 1);
  return parseInt(formattedDollarValue.replaceAll(",", ""));
};

type CreditPullType = "SOFT" | "HARD";

const CREDIT_PULL_TYPES: Record<CreditPullType, CreditPullType> = {
  SOFT: "SOFT",
  HARD: "HARD",
};

const getCreditPullType = (text: string): CreditPullType | null => {
  if (["soft"].some((el) => text.includes(el))) return CREDIT_PULL_TYPES.SOFT;
  if (["hard"].some((el) => text.includes(el))) return CREDIT_PULL_TYPES.HARD;
  return null;
};

type CreditFundingStates = "ALLOWED" | "PROHIBITED";

// const CREDIT_FUNDING: Record<CreditFunding, CreditFunding> = {
const CREDIT_FUNDING_STATES: Record<CreditFundingStates, CreditFundingStates> = {
  ALLOWED: "ALLOWED",
  PROHIBITED: "PROHIBITED",
};

const getCreditFunding = (text: string): CreditFundingStates | null => {
  if (["can"].some((el) => text.includes(el))) return CREDIT_FUNDING_STATES.ALLOWED;
  if (["none", "no"].some((el) => text.includes(el))) return CREDIT_FUNDING_STATES.PROHIBITED;
  return null;
};

const isMaxBonusAmount = (text: string): boolean => {
  return ["maximum bonus amount"].some((el) => text.includes(el));
};

const isAvailability = (text: string): boolean => {
  return ["availability"].some((el) => text.includes(el));
};

const isPostReview = (text: string): boolean => {
  return ["read our post", "read our full post"].some((el) => text.includes(el));
};

const isCreditPull = (text: string): boolean => {
  return ["soft pull", "hard pull", "hard/soft pull"].some((el) => text.includes(el));
};

const isCreditFunding = (text: string): boolean => {
  return ["fund", "funding", "credit card"].some((el) => text.includes(el));
};

const isDirectDeposit = (text: string): boolean => {
  return ["direct deposit"].some((el) => text.includes(el));
};

const isChexSystems = (text: string): boolean => {
  return ["chexsystems"].some((el) => text.includes(el));
};

scrape();
