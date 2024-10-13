import {
  Message,
  StreamingTextResponse,
  createStreamDataTransformer,
} from "ai";
import { PromptTemplate } from "@langchain/core/prompts";
import { HttpResponseOutputParser } from "langchain/output_parsers";

import { JSONLoader } from "langchain/document_loaders/fs/json";
import { RunnableSequence } from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { CharacterTextSplitter } from "langchain/text_splitter";
import { ChatOllama } from "@langchain/community/chat_models/ollama";
// import { auth } from "@/app/_lib/auth";

const data = [
  {
    state: "Alabama",
    slug: "alabama",
    code: "AL",
    nickname: "Yellowhammer State",
    website: "http://www.alabama.gov",
    admission_date: "1819-12-14",
    admission_number: 22,
    capital_city: "Montgomery",
    capital_url: "http://www.montgomeryal.gov",
    population: 4833722,
    population_rank: 23,
    constitution_url:
      "http://alisondb.legislature.state.al.us/alison/default.aspx",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/alabama-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/alabama-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/alabama-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/alabama.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/alabama.jpg",
    twitter_url: "https://twitter.com/alabamagov",
    facebook_url: "https://www.facebook.com/alabamagov",
  },
  {
    state: "Alaska",
    slug: "alaska",
    code: "AK",
    nickname: "The Last Frontier",
    website: "http://alaska.gov",
    admission_date: "1959-01-03",
    admission_number: 49,
    capital_city: "Juneau",
    capital_url: "http://www.juneau.org",
    population: 735132,
    population_rank: 47,
    constitution_url:
      "http://www.legis.state.ak.us/basis/folioproxy.asp?url=http://wwwjnu01.legis.state.ak.us/cgi-bin/folioisa.dll/acontxt/query=*/doc/{t1}?",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/alaska-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/alaska-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/alaska-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/alaska.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/alaska.jpg",
    twitter_url: "https://twitter.com/alaska",
    facebook_url: "https://www.facebook.com/AlaskaLocalGovernments",
  },
  {
    state: "Arizona",
    slug: "arizona",
    code: "AZ",
    nickname: "The Grand Canyon State",
    website: "https://az.gov",
    admission_date: "1912-02-14",
    admission_number: 48,
    capital_city: "Phoenix",
    capital_url: "https://www.phoenix.gov",
    population: 6626624,
    population_rank: 15,
    constitution_url: "http://www.azleg.gov/Constitution.asp",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/arizona-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/arizona-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/arizona-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/arizona.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/arizona.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Arkansas",
    slug: "arkansas",
    code: "AR",
    nickname: "The Natural State",
    website: "http://arkansas.gov",
    admission_date: "1836-06-15",
    admission_number: 25,
    capital_city: "Little Rock",
    capital_url: "http://www.littlerock.org",
    population: 2959373,
    population_rank: 32,
    constitution_url:
      "http://www.arkleg.state.ar.us/assembly/Summary/ArkansasConstitution1874.pdf",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/arkansas-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/arkansas-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/arkansas-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/arkansas.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/arkansas.jpg",
    twitter_url: "https://twitter.com/arkansasgov",
    facebook_url: "https://www.facebook.com/Arkansas.gov",
  },
  {
    state: "California",
    slug: "california",
    code: "CA",
    nickname: "Golden State",
    website: "http://www.ca.gov",
    admission_date: "1850-09-09",
    admission_number: 31,
    capital_city: "Sacramento",
    capital_url: "http://www.cityofsacramento.org",
    population: 38332521,
    population_rank: 1,
    constitution_url: "http://www.leginfo.ca.gov/const-toc.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/california-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/california-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/california-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/california.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/california.jpg",
    twitter_url: "https://twitter.com/cagovernment",
    facebook_url: null,
  },
  {
    state: "Colorado",
    slug: "colorado",
    code: "CO",
    nickname: "The Centennial State",
    website: "https://www.colorado.gov",
    admission_date: "1876-08-01",
    admission_number: 38,
    capital_city: "Denver",
    capital_url: "http://www.denvergov.org",
    population: 5268367,
    population_rank: 22,
    constitution_url: "https://www.colorado.gov/pacific/archives/government",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/colorado-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/colorado-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/colorado-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/colorado.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/colorado.jpg",
    twitter_url: "https://twitter.com/coloradogov",
    facebook_url: "https://www.facebook.com/Colorado.gov",
  },
  {
    state: "Connecticut",
    slug: "connecticut",
    code: "CT",
    nickname: "Constitution State",
    website: "http://www.ct.gov",
    admission_date: "1788-01-09",
    admission_number: 5,
    capital_city: "Hartford",
    capital_url: "http://www.hartford.gov",
    population: 3596080,
    population_rank: 29,
    constitution_url: "http://www.ct.gov/sots/cwp/view.asp?a=3188&q=392288",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/connecticut-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/connecticut-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/connecticut-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/connecticut.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/connecticut.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Delaware",
    slug: "delaware",
    code: "DE",
    nickname: "The First State / The Diamond State",
    website: "http://delaware.gov",
    admission_date: "1787-12-07",
    admission_number: 1,
    capital_city: "Dover",
    capital_url: "http://www.cityofdover.com",
    population: 925749,
    population_rank: 45,
    constitution_url: "http://www.state.de.us/facts/constit/welcome.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/delaware-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/delaware-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/delaware-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/delaware.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/delaware.jpg",
    twitter_url: "https://twitter.com/delaware_gov",
    facebook_url: "https://www.facebook.com/delaware.gov",
  },
  {
    state: "Florida",
    slug: "florida",
    code: "FL",
    nickname: "Sunshine State",
    website: "http://www.myflorida.com",
    admission_date: "1845-03-03",
    admission_number: 27,
    capital_city: "Tallahassee",
    capital_url: "https://www.talgov.com/Main/Home.aspx",
    population: 19552860,
    population_rank: 4,
    constitution_url: "http://www.leg.state.fl.us/Statutes/index.cfm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/florida-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/florida-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/florida-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/florida.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/florida.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Georgia",
    slug: "georgia",
    code: "GA",
    nickname: "Peach State",
    website: "http://georgia.gov",
    admission_date: "1788-01-02",
    admission_number: 4,
    capital_city: "Atlanta",
    capital_url: "http://www.atlantaga.gov",
    population: 9992167,
    population_rank: 8,
    constitution_url:
      "http://sos.ga.gov/admin/files/Constitution_2013_Final_Printed.pdf",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/georgia-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/georgia-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/georgia-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/georgia.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/georgia.jpg",
    twitter_url: "http://twitter.com/georgiagov",
    facebook_url: "http://www.facebook.com/pages/georgiagov/29760668054",
  },
  {
    state: "Hawaii",
    slug: "hawaii",
    code: "HI",
    nickname: "Aloha State",
    website: "https://www.ehawaii.gov",
    admission_date: "1959-08-21",
    admission_number: 50,
    capital_city: "Honolulu",
    capital_url: "http://www.co.honolulu.hi.us",
    population: 1404054,
    population_rank: 40,
    constitution_url: "http://lrbhawaii.org/con",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/hawaii-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/hawaii-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/hawaii-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/hawaii.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/hawaii.jpg",
    twitter_url: "https://twitter.com/ehawaiigov",
    facebook_url: "https://www.facebook.com/ehawaii.gov",
  },
  {
    state: "Idaho",
    slug: "idaho",
    code: "ID",
    nickname: "Gem State",
    website: "https://www.idaho.gov",
    admission_date: "1890-07-03",
    admission_number: 43,
    capital_city: "Boise",
    capital_url: "http://www.cityofboise.org",
    population: 1612136,
    population_rank: 39,
    constitution_url: "http://www.legislature.idaho.gov/idstat/IC/Title003.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/idaho-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/idaho-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/idaho-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/idaho.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/idaho.jpg",
    twitter_url: "https://twitter.com/IDAHOgov",
    facebook_url: null,
  },
  {
    state: "Illinois",
    slug: "illinois",
    code: "IL",
    nickname: "Prairie State",
    website: "https://www.illinois.gov",
    admission_date: "1818-12-03",
    admission_number: 21,
    capital_city: "Springfield",
    capital_url: "http://www.springfield.il.us",
    population: 12882135,
    population_rank: 5,
    constitution_url: "http://www.ilga.gov/commission/lrb/conmain.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/illinois-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/illinois-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/illinois-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/illinois.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/illinois.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Indiana",
    slug: "indiana",
    code: "IN",
    nickname: "Hoosier State",
    website: "http://www.in.gov",
    admission_date: "1816-12-11",
    admission_number: 19,
    capital_city: "Indianapolis",
    capital_url: "http://www.indy.gov/Pages/Home.aspx",
    population: 6570902,
    population_rank: 16,
    constitution_url: "http://www.law.indiana.edu/uslawdocs/inconst.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/indiana-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/indiana-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/indiana-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/indiana.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/indiana.jpg",
    twitter_url: "https://twitter.com/in_gov",
    facebook_url: "https://www.facebook.com/IndianaGovernment",
  },
  {
    state: "Iowa",
    slug: "iowa",
    code: "IA",
    nickname: "Hawkeye State",
    website: "https://www.iowa.gov",
    admission_date: "1846-12-28",
    admission_number: 29,
    capital_city: "Des Moines",
    capital_url: "http://www.ci.des-moines.ia.us",
    population: 3090416,
    population_rank: 30,
    constitution_url: "http://publications.iowa.gov/135/1/history/7-7.html",
    state_flag_url: "https://cdn.civil.services/us-states/flags/iowa-large.png",
    state_seal_url: "https://cdn.civil.services/us-states/seals/iowa-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/iowa-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/iowa.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/iowa.jpg",
    twitter_url: "https://twitter.com/IAGOVTWEETS",
    facebook_url: null,
  },
  {
    state: "Kansas",
    slug: "kansas",
    code: "KS",
    nickname: "Sunflower State",
    website: "https://www.kansas.gov",
    admission_date: "1861-01-29",
    admission_number: 34,
    capital_city: "Topeka",
    capital_url: "http://www.topeka.org",
    population: 2893957,
    population_rank: 34,
    constitution_url: "https://kslib.info/405/Kansas-Constitution",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/kansas-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/kansas-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/kansas-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/kansas.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/kansas.jpg",
    twitter_url: "http://www.twitter.com/ksgovernment",
    facebook_url:
      "http://www.facebook.com/pages/Topeka-KS/Kansasgov-Kansas-Government-Online/52068474220",
  },
  {
    state: "Kentucky",
    slug: "kentucky",
    code: "KY",
    nickname: "Bluegrass State",
    website: "http://kentucky.gov",
    admission_date: "1792-06-01",
    admission_number: 15,
    capital_city: "Frankfort",
    capital_url: "http://frankfort.ky.gov",
    population: 4395295,
    population_rank: 26,
    constitution_url: "http://www.lrc.state.ky.us/Legresou/Constitu/intro.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/kentucky-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/kentucky-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/kentucky-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/kentucky.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/kentucky.jpg",
    twitter_url: "https://twitter.com/kygov",
    facebook_url: "https://www.facebook.com/kygov",
  },
  {
    state: "Louisiana",
    slug: "louisiana",
    code: "LA",
    nickname: "Pelican State",
    website: "http://louisiana.gov",
    admission_date: "1812-04-30",
    admission_number: 18,
    capital_city: "Baton Rouge",
    capital_url: "http://brgov.com",
    population: 4625470,
    population_rank: 25,
    constitution_url: "http://senate.legis.state.la.us/Documents/Constitution",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/louisiana-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/louisiana-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/louisiana-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/louisiana.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/louisiana.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Maine",
    slug: "maine",
    code: "ME",
    nickname: "Pine Tree State",
    website: "http://www.maine.gov",
    admission_date: "1820-03-15",
    admission_number: 23,
    capital_city: "Augusta",
    capital_url: "http://www.augustamaine.gov",
    population: 1328302,
    population_rank: 41,
    constitution_url: "http://www.maine.gov/legis/const",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/maine-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/maine-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/maine-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/maine.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/maine.jpg",
    twitter_url: "https://twitter.com/mainegov_news",
    facebook_url:
      "http://www.facebook.com/pages/Augusta-ME/Mainegov/98519328240",
  },
  {
    state: "Maryland",
    slug: "maryland",
    code: "MD",
    nickname: "Old Line State",
    website: "http://www.maryland.gov",
    admission_date: "1788-04-28",
    admission_number: 7,
    capital_city: "Annapolis",
    capital_url: "http://www.annapolis.gov",
    population: 5928814,
    population_rank: 19,
    constitution_url:
      "http://msa.maryland.gov/msa/mdmanual/43const/html/const.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/maryland-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/maryland-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/maryland-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/maryland.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/maryland.jpg",
    twitter_url: "https://twitter.com/statemaryland",
    facebook_url: "https://www.facebook.com/statemaryland",
  },
  {
    state: "Massachusetts",
    slug: "massachusetts",
    code: "MA",
    nickname: "Bay State",
    website: "http://www.mass.gov",
    admission_date: "1788-02-06",
    admission_number: 6,
    capital_city: "Boston",
    capital_url: "http://www.ci.boston.ma.us",
    population: 6692824,
    population_rank: 14,
    constitution_url: "http://www.state.ma.us/legis/const.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/massachusetts-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/massachusetts-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/massachusetts-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/massachusetts.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/massachusetts.jpg",
    twitter_url: "http://twitter.com/massgov",
    facebook_url: "https://www.facebook.com/massgov",
  },
  {
    state: "Michigan",
    slug: "michigan",
    code: "MI",
    nickname: "Wolverine State / Great Lakes State",
    website: "http://www.michigan.gov",
    admission_date: "1837-01-26",
    admission_number: 26,
    capital_city: "Lansing",
    capital_url: "http://cityoflansingmi.com",
    population: 9895622,
    population_rank: 9,
    constitution_url:
      "http://www.legislature.mi.gov/(S(hrowl12tg05hemnnkidim1jb))/mileg.aspx?page=GetObject&objectname=mcl-Constitution",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/michigan-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/michigan-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/michigan-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/michigan.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/michigan.jpg",
    twitter_url: "https://twitter.com/migov",
    facebook_url: "https://www.facebook.com/MIgovernment",
  },
  {
    state: "Minnesota",
    slug: "minnesota",
    code: "MN",
    nickname: "North Star State / Land of 10,000 Lakes",
    website: "https://mn.gov",
    admission_date: "1858-05-11",
    admission_number: 32,
    capital_city: "Saint Paul",
    capital_url: "http://www.stpaul.gov",
    population: 5420380,
    population_rank: 21,
    constitution_url:
      "http://www.house.leg.state.mn.us/cco/rules/mncon/preamble.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/minnesota-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/minnesota-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/minnesota-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/minnesota.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/minnesota.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Mississippi",
    slug: "mississippi",
    code: "MS",
    nickname: "Magnolia State",
    website: "http://www.ms.gov",
    admission_date: "1817-12-10",
    admission_number: 20,
    capital_city: "Jackson",
    capital_url: "http://www.city.jackson.ms.us",
    population: 2991207,
    population_rank: 31,
    constitution_url: "http://law.justia.com/constitution/mississippi",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/mississippi-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/mississippi-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/mississippi-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/mississippi.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/mississippi.jpg",
    twitter_url: "https://twitter.com/msdotgov",
    facebook_url: "https://www.facebook.com/msdotgov",
  },
  {
    state: "Missouri",
    slug: "missouri",
    code: "MO",
    nickname: "Show Me State",
    website: "https://www.mo.gov",
    admission_date: "1821-08-10",
    admission_number: 24,
    capital_city: "Jefferson City",
    capital_url: "http://www.jeffcitymo.org",
    population: 6044171,
    population_rank: 18,
    constitution_url: "http://www.moga.mo.gov/mostatutes/moconstn.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/missouri-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/missouri-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/missouri-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/missouri.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/missouri.jpg",
    twitter_url: "https://twitter.com/MoGov",
    facebook_url: "https://www.facebook.com/mogov",
  },
  {
    state: "Montana",
    slug: "montana",
    code: "MT",
    nickname: "Treasure State",
    website: "http://mt.gov",
    admission_date: "1889-11-08",
    admission_number: 41,
    capital_city: "Helena",
    capital_url: "http://www.ci.helena.mt.us",
    population: 1015165,
    population_rank: 44,
    constitution_url: "http://courts.mt.gov/content/library/docs/72constit.pdf",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/montana-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/montana-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/montana-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/montana.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/montana.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Nebraska",
    slug: "nebraska",
    code: "NE",
    nickname: "Cornhusker State",
    website: "http://www.nebraska.gov",
    admission_date: "1867-03-01",
    admission_number: 37,
    capital_city: "Lincoln",
    capital_url: "http://lincoln.ne.gov",
    population: 1868516,
    population_rank: 37,
    constitution_url: "http://www.state.ne.us/legislative/statutes/C",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/nebraska-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/nebraska-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/nebraska-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/nebraska.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/nebraska.jpg",
    twitter_url: "https://twitter.com/Nebraskagov",
    facebook_url: "https://www.facebook.com/nebraska.gov",
  },
  {
    state: "Nevada",
    slug: "nevada",
    code: "NV",
    nickname: "The Silver State",
    website: "http://nv.gov",
    admission_date: "1864-10-31",
    admission_number: 36,
    capital_city: "Carson City",
    capital_url: "http://www.carson.org",
    population: 2790136,
    population_rank: 35,
    constitution_url: "http://www.leg.state.nv.us/Const/NvConst.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/nevada-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/nevada-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/nevada-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/nevada.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/nevada.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "New Hampshire",
    slug: "new-hampshire",
    code: "NH",
    nickname: "Granite State",
    website: "https://www.nh.gov",
    admission_date: "1788-06-21",
    admission_number: 9,
    capital_city: "Concord",
    capital_url: "http://www.concordnh.gov",
    population: 1323459,
    population_rank: 42,
    constitution_url: "http://www.state.nh.us/constitution/constitution.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/new-hampshire-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/new-hampshire-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/new-hampshire-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/new-hampshire.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/new-hampshire.jpg",
    twitter_url: "https://twitter.com/nhgov",
    facebook_url: null,
  },
  {
    state: "New Jersey",
    slug: "new-jersey",
    code: "NJ",
    nickname: "Garden State",
    website: "http://www.state.nj.us",
    admission_date: "1787-12-18",
    admission_number: 3,
    capital_city: "Trenton",
    capital_url: "http://www.trentonnj.org",
    population: 8899339,
    population_rank: 11,
    constitution_url:
      "http://www.njleg.state.nj.us/lawsconstitution/consearch.asp",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/new-jersey-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/new-jersey-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/new-jersey-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/new-jersey.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/new-jersey.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "New Mexico",
    slug: "new-mexico",
    code: "NM",
    nickname: "Land of Enchantment",
    website: "http://www.newmexico.gov",
    admission_date: "1912-01-06",
    admission_number: 47,
    capital_city: "Santa Fe",
    capital_url: "http://www.santafenm.gov",
    population: 2085287,
    population_rank: 36,
    constitution_url: "http://www.loc.gov/law/guide/us-nm.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/new-mexico-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/new-mexico-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/new-mexico-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/new-mexico.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/new-mexico.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "New York",
    slug: "new-york",
    code: "NY",
    nickname: "Empire State",
    website: "http://www.ny.gov",
    admission_date: "1788-07-26",
    admission_number: 11,
    capital_city: "Albany",
    capital_url: "http://www.albanyny.org",
    population: 19651127,
    population_rank: 3,
    constitution_url: "https://www.dos.ny.gov/info/constitution.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/new-york-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/new-york-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/new-york-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/new-york.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/new-york.jpg",
    twitter_url: "https://twitter.com/nygov",
    facebook_url: null,
  },
  {
    state: "North Carolina",
    slug: "north-carolina",
    code: "NC",
    nickname: "Old North State / Tar Heel State",
    website: "http://www.nc.gov",
    admission_date: "1789-11-21",
    admission_number: 12,
    capital_city: "Raleigh",
    capital_url: "http://www.raleigh-nc.org",
    population: 9848060,
    population_rank: 10,
    constitution_url:
      "http://statelibrary.dcr.state.nc.us/nc/stgovt/preconst.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/north-carolina-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/north-carolina-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/north-carolina-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/north-carolina.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/north-carolina.jpg",
    twitter_url: "https://twitter.com/NCdotGov",
    facebook_url: null,
  },
  {
    state: "North Dakota",
    slug: "north-dakota",
    code: "ND",
    nickname: "Peace Garden State / Flickertail State / Roughrider State",
    website: "http://www.nd.gov",
    admission_date: "1889-11-02",
    admission_number: 39,
    capital_city: "Bismarck",
    capital_url: "http://www.bismarck.org",
    population: 723393,
    population_rank: 48,
    constitution_url:
      "http://www.legis.nd.gov/information/statutes/const-laws.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/north-dakota-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/north-dakota-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/north-dakota-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/north-dakota.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/north-dakota.jpg",
    twitter_url: "https://twitter.com/ExperienceND",
    facebook_url: "https://www.facebook.com/ExperienceND",
  },
  {
    state: "Ohio",
    slug: "ohio",
    code: "OH",
    nickname: "Buckeye State",
    website: "https://ohio.gov",
    admission_date: "1803-03-01",
    admission_number: 17,
    capital_city: "Columbus",
    capital_url: "http://ci.columbus.oh.us",
    population: 11570808,
    population_rank: 7,
    constitution_url: "http://www.legislature.state.oh.us/constitution.cfm",
    state_flag_url: "https://cdn.civil.services/us-states/flags/ohio-large.png",
    state_seal_url: "https://cdn.civil.services/us-states/seals/ohio-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/ohio-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/ohio.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/ohio.jpg",
    twitter_url: "https://twitter.com/ohgov",
    facebook_url: null,
  },
  {
    state: "Oklahoma",
    slug: "oklahoma",
    code: "OK",
    nickname: "Sooner State",
    website: "https://www.ok.gov",
    admission_date: "1907-11-16",
    admission_number: 46,
    capital_city: "Oklahoma City",
    capital_url: "http://www.okc.gov",
    population: 3850568,
    population_rank: 28,
    constitution_url: "http://oklegal.onenet.net/okcon",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/oklahoma-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/oklahoma-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/oklahoma-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/oklahoma.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/oklahoma.jpg",
    twitter_url: "https://twitter.com/okgov",
    facebook_url: "https://www.facebook.com/okgov",
  },
  {
    state: "Oregon",
    slug: "oregon",
    code: "OR",
    nickname: "Beaver State",
    website: "http://www.oregon.gov",
    admission_date: "1859-02-14",
    admission_number: 33,
    capital_city: "Salem",
    capital_url: "http://www.cityofsalem.net/Pages/default.aspx",
    population: 3930065,
    population_rank: 27,
    constitution_url:
      "http://bluebook.state.or.us/state/constitution/constitution.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/oregon-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/oregon-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/oregon-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/oregon.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/oregon.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Pennsylvania",
    slug: "pennsylvania",
    code: "PA",
    nickname: "Keystone State",
    website: "http://www.pa.gov",
    admission_date: "1787-12-12",
    admission_number: 2,
    capital_city: "Harrisburg",
    capital_url: "http://harrisburgpa.gov",
    population: 12773801,
    population_rank: 6,
    constitution_url: "http://sites.state.pa.us/PA_Constitution.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/pennsylvania-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/pennsylvania-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/pennsylvania-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/pennsylvania.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/pennsylvania.jpg",
    twitter_url: "https://www.facebook.com/visitPA",
    facebook_url: "https://twitter.com/visitPA",
  },
  {
    state: "Rhode Island",
    slug: "rhode-island",
    code: "RI",
    nickname: "The Ocean State",
    website: "https://www.ri.gov",
    admission_date: "1790-05-29",
    admission_number: 13,
    capital_city: "Providence",
    capital_url: "http://www.providenceri.com",
    population: 1051511,
    population_rank: 43,
    constitution_url: "http://webserver.rilin.state.ri.us/RiConstitution",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/rhode-island-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/rhode-island-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/rhode-island-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/rhode-island.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/rhode-island.jpg",
    twitter_url: "https://twitter.com/rigov",
    facebook_url:
      "https://www.facebook.com/RIgov-Rhode-Island-Government-Online-24056655991",
  },
  {
    state: "South Carolina",
    slug: "south-carolina",
    code: "SC",
    nickname: "Palmetto State",
    website: "http://www.sc.gov",
    admission_date: "1788-05-23",
    admission_number: 8,
    capital_city: "Columbia",
    capital_url: "http://www.columbiasc.net",
    population: 4774839,
    population_rank: 24,
    constitution_url: "http://www.scstatehouse.gov/scconstitution/scconst.php",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/south-carolina-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/south-carolina-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/south-carolina-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/south-carolina.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/south-carolina.jpg",
    twitter_url: "https://twitter.com/scgov",
    facebook_url: "http://www.facebook.com/pages/SCgov/12752057990",
  },
  {
    state: "South Dakota",
    slug: "south-dakota",
    code: "SD",
    nickname: "Mount Rushmore State",
    website: "http://sd.gov",
    admission_date: "1889-11-02",
    admission_number: 40,
    capital_city: "Pierre",
    capital_url: "http://ci.pierre.sd.us",
    population: 844877,
    population_rank: 46,
    constitution_url: "http://legis.sd.gov/statutes/Constitution",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/south-dakota-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/south-dakota-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/south-dakota-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/south-dakota.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/south-dakota.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Tennessee",
    slug: "tennessee",
    code: "TN",
    nickname: "Volunteer State",
    website: "https://www.tn.gov",
    admission_date: "1796-06-01",
    admission_number: 16,
    capital_city: "Nashville",
    capital_url: "http://www.nashville.gov",
    population: 6495978,
    population_rank: 17,
    constitution_url:
      "http://www.capitol.tn.gov/about/docs/TN-Constitution.pdf",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/tennessee-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/tennessee-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/tennessee-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/tennessee.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/tennessee.jpg",
    twitter_url: "https://twitter.com/TNVacation",
    facebook_url: "https://www.facebook.com/tnvacation",
  },
  {
    state: "Texas",
    slug: "texas",
    code: "TX",
    nickname: "Lone Star State",
    website: "https://www.texas.gov",
    admission_date: "1845-12-29",
    admission_number: 28,
    capital_city: "Austin",
    capital_url: "http://www.austintexas.gov",
    population: 26448193,
    population_rank: 2,
    constitution_url: "http://www.constitution.legis.state.tx.us",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/texas-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/texas-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/texas-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/texas.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/texas.jpg",
    twitter_url: "https://twitter.com/texasgov",
    facebook_url: "http://www.facebook.com/Texas.gov",
  },
  {
    state: "Utah",
    slug: "utah",
    code: "UT",
    nickname: "The Beehive State",
    website: "https://utah.gov",
    admission_date: "1896-01-04",
    admission_number: 45,
    capital_city: "Salt Lake City",
    capital_url: "http://www.slcgov.com",
    population: 2900872,
    population_rank: 33,
    constitution_url:
      "http://le.utah.gov/UtahCode/chapter.jsp?code=Constitution",
    state_flag_url: "https://cdn.civil.services/us-states/flags/utah-large.png",
    state_seal_url: "https://cdn.civil.services/us-states/seals/utah-large.png",
    map_image_url: "https://cdn.civil.services/us-states/maps/utah-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/utah.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/utah.jpg",
    twitter_url: "https://twitter.com/UtahGov",
    facebook_url: "https://www.facebook.com/utahgov",
  },
  {
    state: "Vermont",
    slug: "vermont",
    code: "VT",
    nickname: "Green Mountain State",
    website: "http://vermont.gov",
    admission_date: "1791-03-04",
    admission_number: 14,
    capital_city: "Montpelier",
    capital_url: "http://www.montpelier-vt.org",
    population: 626630,
    population_rank: 49,
    constitution_url: "http://www.leg.state.vt.us/statutes/const2.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/vermont-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/vermont-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/vermont-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/vermont.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/vermont.jpg",
    twitter_url: "https://twitter.com/vermontgov",
    facebook_url: "https://www.facebook.com/MyVermont",
  },
  {
    state: "Virginia",
    slug: "virginia",
    code: "VA",
    nickname: "Old Dominion State",
    website: "https://www.virginia.gov",
    admission_date: "1788-06-25",
    admission_number: 10,
    capital_city: "Richmond",
    capital_url: "http://www.richmondgov.com",
    population: 8260405,
    population_rank: 12,
    constitution_url:
      "http://hodcap.state.va.us/publications/Constitution-01-13.pdf",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/virginia-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/virginia-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/virginia-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/virginia.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/virginia.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Washington",
    slug: "washington",
    code: "WA",
    nickname: "The Evergreen State",
    website: "http://www.wa.gov",
    admission_date: "1889-11-11",
    admission_number: 42,
    capital_city: "Olympia",
    capital_url: "http://www.ci.olympia.wa.us",
    population: 6971406,
    population_rank: 13,
    constitution_url:
      "http://www.leg.wa.gov/lawsandagencyrules/pages/constitution.aspx",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/washington-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/washington-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/washington-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/washington.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/washington.jpg",
    twitter_url: "https://twitter.com/wagov",
    facebook_url: "",
  },
  {
    state: "West Virginia",
    slug: "west-virginia",
    code: "WV",
    nickname: "Mountain State",
    website: "http://www.wv.gov",
    admission_date: "1863-06-20",
    admission_number: 35,
    capital_city: "Charleston",
    capital_url: "http://www.cityofcharleston.org",
    population: 1854304,
    population_rank: 38,
    constitution_url: "http://www.legis.state.wv.us/WVCODE/WV_CON.cfm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/west-virginia-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/west-virginia-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/west-virginia-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/west-virginia.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/west-virginia.jpg",
    twitter_url: "https://twitter.com/wvgov",
    facebook_url: "https://www.facebook.com/wvgov",
  },
  {
    state: "Wisconsin",
    slug: "wisconsin",
    code: "WI",
    nickname: "Badger State",
    website: "https://www.wisconsin.gov",
    admission_date: "1848-05-29",
    admission_number: 30,
    capital_city: "Madison",
    capital_url: "http://www.ci.madison.wi.us",
    population: 5742713,
    population_rank: 20,
    constitution_url: "http://www.legis.state.wi.us/rsb/2wiscon.html",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/wisconsin-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/wisconsin-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/wisconsin-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/wisconsin.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/wisconsin.jpg",
    twitter_url: null,
    facebook_url: null,
  },
  {
    state: "Wyoming",
    slug: "wyoming",
    code: "WY",
    nickname: "Equality State",
    website: "http://www.wyo.gov",
    admission_date: "1890-07-10",
    admission_number: 44,
    capital_city: "Cheyenne",
    capital_url: "http://www.cheyennecity.org",
    population: 582658,
    population_rank: 50,
    constitution_url:
      "http://legisweb.state.wy.us/statutes/constitution.aspx?file=titles/97Title97.htm",
    state_flag_url:
      "https://cdn.civil.services/us-states/flags/wyoming-large.png",
    state_seal_url:
      "https://cdn.civil.services/us-states/seals/wyoming-large.png",
    map_image_url:
      "https://cdn.civil.services/us-states/maps/wyoming-large.png",
    landscape_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/landscape/wyoming.jpg",
    skyline_background_url:
      "https://cdn.civil.services/us-states/backgrounds/1280x720/skyline/wyoming.jpg",
    twitter_url: null,
    facebook_url: null,
  },
];

// const loader = new JSONLoader("app/_lib/data.json", [
//   "/state",
//   "/code",
//   "/nickname",
//   "/website",
//   "/admission_date",
//   "/admission_number",
//   "/capital_city",
//   "/capital_url",
//   "/population",
//   "/population_rank",
//   "/constitution_url",
//   "/twitter_url",
// ]);

const loader = new JSONLoader("app/_lib/data.json", [
  "/id",
  "/created_at",
  "/startDate",
  "/endDate",
  "/numNights",
  "/numGuests",
  "/totalPrice",
  "/guestId",
  "/cabinId",
]);

export const dynamic = "force-dynamic";

/**
 * Basic memory formatter that stringifies and passes
 * message history directly into the model.
 */
const formatMessage = (message) => {
  return `${message.role}: ${message.content}`;
};

const TEMPLATE = `Answer the user's questions based only on the following context. If the answer is not in the context, reply politely that you do not have that information available.:
==============================
Context: {context}
==============================
Current conversation: {chat_history}

user: {question}
assistant:`;

export async function POST(req) {
  try {
    // const session = await auth();
    // console.log("user dnfbdf = ", session);
    // Extract the `messages` from the body of the request
    const { messages } = await req.json();

    console.log(messages);
    // const data = await getBookings(session.user.guestId);
    // console.log("bookings = ", data);

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);

    const currentMessageContent = messages[messages.length - 1].content;

    console.log(formattedPreviousMessages);
    console.log(currentMessageContent);

    const docs = await loader.load();
    console.log("docs = ", docs);

    const prompt = PromptTemplate.fromTemplate(TEMPLATE);

    const model = new ChatOllama({
      model: "llama3:8b",
      temperature: 0,
      verbose: true,
    });
    /**
     * Chat models stream message chunks rather than bytes, so this
     * output parser handles serialization and encoding.
     */
    const parser = new HttpResponseOutputParser();

    const chain = RunnableSequence.from([
      {
        question: (input) => input.question,
        chat_history: (input) => input.chat_history,
        context: () => formatDocumentsAsString(docs),
      },
      prompt,
      model,
      parser,
    ]);

    // Convert the response into a friendly text-stream
    const stream = await chain.stream({
      chat_history: formattedPreviousMessages.join("\n"),
      question: currentMessageContent,
    });

    console.log("stream = ", stream);

    // Respond with the stream
    return new StreamingTextResponse(
      stream.pipeThrough(createStreamDataTransformer())
    );

    // return Response.json({ message: "Success" }, { status: 200 });
  } catch (e) {
    console.log(e);
    return Response.json({ error: e.message }, { status: e.status ?? 500 });
  }
}
