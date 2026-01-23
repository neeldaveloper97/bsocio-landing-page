import { Metadata } from "next";
import Image from "next/image";
import CtaImpactSection from "@/components/layout/CtaImpactSection";
import "./page.css";

export const metadata: Metadata = {
  title: "How It Works - Bsocio",
  description:
    "Learn how Bsocio works in just 4 easy steps. Our intelligent giving system automates generosity with zero out-of-pocket cost.",
};

// SVG Icons as components
const GiftIcon = () => (
  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M27.9903 11.1963H5.59823C4.82531 11.1963 4.19873 11.8229 4.19873 12.5958V15.3948C4.19873 16.1677 4.82531 16.7943 5.59823 16.7943H27.9903C28.7632 16.7943 29.3898 16.1677 29.3898 15.3948V12.5958C29.3898 11.8229 28.7632 11.1963 27.9903 11.1963Z"
      style={{ stroke: 'var(--secondary-green)' }} strokeWidth="2.79901" strokeLinecap="round"
      strokeLinejoin="round" />
    <path d="M16.7939 11.1963V29.3898" style={{ stroke: 'var(--secondary-green)' }}
      strokeWidth="2.79901" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M26.5906 16.7939V26.5905C26.5906 27.3328 26.2957 28.0447 25.7708 28.5697C25.2459 29.0946 24.5339 29.3895 23.7916 29.3895H9.79656C9.05422 29.3895 8.34228 29.0946 7.81737 28.5697C7.29245 28.0447 6.99756 27.3328 6.99756 26.5905V16.7939"
      style={{ stroke: 'var(--secondary-green)' }} strokeWidth="2.79901" strokeLinecap="round"
      strokeLinejoin="round" />
    <path
      d="M10.4963 11.1964C9.56839 11.1964 8.67847 10.8278 8.02232 10.1716C7.36618 9.51546 6.99756 8.62554 6.99756 7.69761C6.99756 6.76968 7.36618 5.87976 8.02232 5.22362C8.67847 4.56747 9.56839 4.19885 10.4963 4.19885C11.8464 4.17533 13.1694 4.83039 14.2928 6.07861C15.4162 7.32683 16.2878 9.11027 16.7941 11.1964C17.3003 9.11027 18.172 7.32683 19.2954 6.07861C20.4188 4.83039 21.7418 4.17533 23.0918 4.19885C24.0198 4.19885 24.9097 4.56747 25.5658 5.22362C26.222 5.87976 26.5906 6.76968 26.5906 7.69761C26.5906 8.62554 26.222 9.51546 25.5658 10.1716C24.9097 10.8278 24.0198 11.1964 23.0918 11.1964"
      style={{ stroke: 'var(--secondary-green)' }} strokeWidth="2.79901" strokeLinecap="round"
      strokeLinejoin="round" />
  </svg>
);

const MedalIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M20.6287 17.1807L22.648 28.5446C22.6706 28.6784 22.6518 28.816 22.5942 28.9388C22.5365 29.0617 22.4427 29.164 22.3254 29.2321C22.208 29.3002 22.0726 29.3309 21.9373 29.32C21.8021 29.3091 21.6733 29.2571 21.5684 29.1711L16.7968 25.5897C16.5664 25.4176 16.2866 25.3246 15.999 25.3246C15.7115 25.3246 15.4317 25.4176 15.2013 25.5897L10.4217 29.1697C10.3168 29.2556 10.1883 29.3075 10.0531 29.3184C9.91804 29.3293 9.78281 29.2988 9.66551 29.2309C9.5482 29.163 9.4544 29.0609 9.39661 28.9383C9.33882 28.8157 9.31979 28.6783 9.34207 28.5446L11.36 17.1807"
      stroke="#7CBB00" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M15.9942 18.6603C20.4109 18.6603 23.9914 15.0799 23.9914 10.6632C23.9914 6.24647 20.4109 2.66602 15.9942 2.66602C11.5775 2.66602 7.99707 6.24647 7.99707 10.6632C7.99707 15.0799 11.5775 18.6603 15.9942 18.6603Z"
      stroke="#7CBB00" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ShareIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 16C0 7.16345 7.16344 0 16 0H47.9915C56.828 0 63.9915 7.16344 63.9915 16V47.9915C63.9915 56.828 56.828 63.9915 47.9915 63.9915H16C7.16345 63.9915 0 56.828 0 47.9915V16Z"
      fill="#7CBB00" />
    <path
      d="M39.9854 26.6642C42.1938 26.6642 43.984 24.8739 43.984 22.6656C43.984 20.4572 42.1938 18.667 39.9854 18.667C37.777 18.667 35.9868 20.4572 35.9868 22.6656C35.9868 24.8739 37.777 26.6642 39.9854 26.6642Z"
      stroke="white" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M23.9913 35.9942C26.1996 35.9942 27.9898 34.204 27.9898 31.9956C27.9898 29.7873 26.1996 27.9971 23.9913 27.9971C21.7829 27.9971 19.9927 29.7873 19.9927 31.9956C19.9927 34.204 21.7829 35.9942 23.9913 35.9942Z"
      stroke="white" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M39.9854 45.3243C42.1938 45.3243 43.984 43.5341 43.984 41.3257C43.984 39.1174 42.1938 37.3271 39.9854 37.3271C37.777 37.3271 35.9868 39.1174 35.9868 41.3257C35.9868 43.5341 37.777 45.3243 39.9854 45.3243Z"
      stroke="white" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M27.4434 34.0078L36.5468 39.3126" stroke="white" strokeWidth="2.66572"
      strokeLinecap="round" strokeLinejoin="round" />
    <path d="M36.5335 24.6777L27.4434 29.9825" stroke="white" strokeWidth="2.66572"
      strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const FlameIcon = () => (
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 16C0 7.16345 7.16344 0 16 0H47.9915C56.828 0 63.9915 7.16344 63.9915 16V47.9915C63.9915 56.828 56.828 63.9915 47.9915 63.9915H16C7.16345 63.9915 0 56.828 0 47.9915V16Z"
      fill="#7CBB00" />
    <path
      d="M27.3232 35.3279C28.207 35.3279 29.0545 34.9768 29.6794 34.3519C30.3043 33.727 30.6554 32.8795 30.6554 31.9957C30.6554 30.1564 29.9889 29.33 29.3225 27.9972C27.8937 25.1408 29.0239 22.5937 31.9882 20C32.6547 23.3321 34.6539 26.531 37.3197 28.6636C39.9854 30.7962 41.3182 33.3286 41.3182 35.9943C41.3182 37.2196 41.0769 38.4328 40.608 39.5648C40.1392 40.6967 39.4519 41.7253 38.5855 42.5916C37.7192 43.458 36.6906 44.1453 35.5587 44.6141C34.4267 45.083 33.2135 45.3243 31.9882 45.3243C30.763 45.3243 29.5497 45.083 28.4178 44.6141C27.2858 44.1453 26.2573 43.458 25.3909 42.5916C24.5245 41.7253 23.8373 40.6967 23.3684 39.5648C22.8995 38.4328 22.6582 37.2196 22.6582 35.9943C22.6582 34.4575 23.2353 32.9367 23.9911 31.9957C23.9911 32.8795 24.3421 33.727 24.967 34.3519C25.5919 34.9768 26.4395 35.3279 27.3232 35.3279Z"
      stroke="white" strokeWidth="2.66572" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const DollarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 2.66699V29.3337" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M22.6667 6.66699H12.6667C11.429 6.66699 10.242 7.15866 9.36684 8.03383C8.49167 8.909 8 10.096 8 11.3337C8 12.5713 8.49167 13.7583 9.36684 14.6335C10.242 15.5087 11.429 16.0003 12.6667 16.0003H19.3333C20.571 16.0003 21.758 16.492 22.6332 17.3672C23.5083 18.2423 24 19.4293 24 20.667C24 21.9047 23.5083 23.0917 22.6332 23.9668C21.758 24.842 20.571 25.3337 19.3333 25.3337H8" stroke="#F65314" strokeWidth="2.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="96" height="96" viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M76 28V16C76 14.9391 75.5786 13.9217 74.8284 13.1716C74.0783 12.4214 73.0609 12 72 12H20C17.8783 12 15.8434 12.8429 14.3431 14.3431C12.8429 15.8434 12 17.8783 12 20C12 22.1217 12.8429 24.1566 14.3431 25.6569C15.8434 27.1571 17.8783 28 20 28H80C81.0609 28 82.0783 28.4214 82.8284 29.1716C83.5786 29.9217 84 30.9391 84 32V48M84 48H72C69.8783 48 67.8434 48.8429 66.3431 50.3431C64.8429 51.8434 64 53.8783 64 56C64 58.1217 64.8429 60.1566 66.3431 61.6569C67.8434 63.1571 69.8783 64 72 64H84C85.0609 64 86.0783 63.5786 86.8284 62.8284C87.5786 62.0783 88 61.0609 88 60V52C88 50.9391 87.5786 49.9217 86.8284 49.1716C86.0783 48.4214 85.0609 48 84 48Z"
      stroke="#1F6AE1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M12 20V76C12 78.1217 12.8429 80.1566 14.3431 81.6569C15.8434 83.1571 17.8783 84 20 84H80C81.0609 84 82.0783 83.5786 82.8284 82.8284C83.5786 82.0783 84 81.0609 84 80V64"
      stroke="#1F6AE1" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const HeartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15.8332 11.6667C17.0748 10.45 18.3332 8.99167 18.3332 7.08333C18.3332 5.86776 17.8503 4.70197 16.9907 3.84243C16.1312 2.98289 14.9654 2.5 13.7498 2.5C12.2832 2.5 11.2498 2.91667 9.99984 4.16667C8.74984 2.91667 7.7165 2.5 6.24984 2.5C5.03426 2.5 3.86847 2.98289 3.00893 3.84243C2.14939 4.70197 1.6665 5.86776 1.6665 7.08333C1.6665 9 2.9165 10.4583 4.1665 11.6667L9.99984 17.5L15.8332 11.6667Z" stroke="#F65314" strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const TrophyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.20996 15L2.65996 7.14C2.46376 6.80087 2.37149 6.41159 2.3946 6.02048C2.41771 5.62937 2.55518 5.25366 2.78996 4.94L4.39996 2.8C4.58625 2.55161 4.82782 2.35 5.10553 2.21115C5.38324 2.07229 5.68947 2 5.99996 2H18C18.3104 2 18.6167 2.07229 18.8944 2.21115C19.1721 2.35 19.4137 2.55161 19.6 2.8L21.2 4.94C21.4363 5.25265 21.5755 5.62784 21.6004 6.01897C21.6253 6.4101 21.5347 6.79992 21.34 7.14L16.79 15" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M11.0001 12.0002L5.12012 2.2002" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13 12.0002L18.88 2.2002" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 7H16" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 22C14.7614 22 17 19.7614 17 17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17C7 19.7614 9.23858 22 12 22Z" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 18V16H11.5" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CrownIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5619 3.26568C11.6051 3.18729 11.6685 3.12191 11.7456 3.07638C11.8226 3.03085 11.9104 3.00684 11.9999 3.00684C12.0894 3.00684 12.1773 3.03085 12.2543 3.07638C12.3314 3.12191 12.3948 3.18729 12.4379 3.26568L15.3899 8.86968C15.4603 8.99944 15.5586 9.11201 15.6776 9.1993C15.7967 9.28659 15.9336 9.34643 16.0785 9.37454C16.2235 9.40265 16.3728 9.39831 16.5159 9.36186C16.6589 9.3254 16.7921 9.25772 16.9059 9.16368L21.1829 5.49968C21.265 5.4329 21.3662 5.3939 21.4719 5.38828C21.5776 5.38266 21.6823 5.41073 21.771 5.46843C21.8598 5.52613 21.9279 5.61049 21.9656 5.70937C22.0033 5.80825 22.0087 5.91655 21.9809 6.01868L19.1469 16.2647C19.0891 16.4743 18.9645 16.6594 18.7919 16.7919C18.6194 16.9243 18.4084 16.9969 18.1909 16.9987H5.80994C5.59227 16.9972 5.38105 16.9247 5.20833 16.7922C5.03561 16.6597 4.91083 16.4745 4.85294 16.2647L2.01994 6.01968C1.99219 5.91755 1.99756 5.80925 2.03528 5.71037C2.073 5.61149 2.14112 5.52713 2.22984 5.46943C2.31855 5.41173 2.42329 5.38366 2.52898 5.38928C2.63466 5.3949 2.73583 5.4339 2.81794 5.50068L7.09394 9.16468C7.20773 9.25872 7.34094 9.3264 7.484 9.36286C7.62705 9.39931 7.77641 9.40365 7.92134 9.37554C8.06626 9.34743 8.20317 9.28759 8.32223 9.2003C8.44129 9.11301 8.53954 9.00044 8.60994 8.87068L11.5619 3.26568Z" stroke="#F65314" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 21H19" stroke="#F65314" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AwardIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 22H20" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10 14.6602V17.0002C10 17.5502 9.53 17.9802 9.03 18.2102C7.85 18.7502 7 20.2402 7 22.0002" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 14.6602V17.0002C14 17.5502 14.47 17.9802 14.97 18.2102C16.15 18.7502 17 20.2402 17 22.0002" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M18 2H6V9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V2Z" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CakeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21V13C20 12.4696 19.7893 11.9609 19.4142 11.5858C19.0391 11.2107 18.5304 11 18 11H6C5.46957 11 4.96086 11.2107 4.58579 11.5858C4.21071 11.9609 4 12.4696 4 13V21" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M4 16C4 16 4.5 15 6 15C7.5 15 8.5 17 10 17C11.5 17 12.5 15 14 15C15.5 15 16.5 17 18 17C19.5 17 20 16 20 16" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M2 21H22" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 8V11" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 8V11" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 8V11" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M7 4H7.01" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4H12.01" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M17 4H17.01" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.5248 2.29489C11.5687 2.20635 11.6364 2.13183 11.7203 2.07972C11.8042 2.02761 11.9011 2 11.9998 2C12.0986 2 12.1955 2.02761 12.2794 2.07972C12.3633 2.13183 12.431 2.20635 12.4748 2.29489L14.7848 6.97389C14.937 7.28186 15.1617 7.5483 15.4395 7.75035C15.7173 7.95239 16.04 8.08401 16.3798 8.13389L21.5458 8.88989C21.6437 8.90408 21.7357 8.94537 21.8113 9.00909C21.887 9.07282 21.9433 9.15644 21.9739 9.2505C22.0045 9.34456 22.0081 9.4453 21.9844 9.54133C21.9607 9.63736 21.9107 9.72485 21.8398 9.79389L18.1038 13.4319C17.8575 13.672 17.6731 13.9684 17.5667 14.2955C17.4602 14.6227 17.4349 14.9708 17.4928 15.3099L18.3748 20.4499C18.3921 20.5477 18.3816 20.6485 18.3443 20.7406C18.3071 20.8327 18.2448 20.9125 18.1644 20.9709C18.084 21.0293 17.9888 21.0639 17.8897 21.0708C17.7906 21.0777 17.6915 21.0566 17.6038 21.0099L12.9858 18.5819C12.6816 18.4221 12.343 18.3386 11.9993 18.3386C11.6557 18.3386 11.3171 18.4221 11.0128 18.5819L6.39585 21.0099C6.30818 21.0563 6.20924 21.0772 6.1103 21.0701C6.01135 21.0631 5.91636 21.0285 5.83614 20.9701C5.75592 20.9118 5.69368 20.8321 5.6565 20.7401C5.61933 20.6482 5.6087 20.5476 5.62585 20.4499L6.50685 15.3109C6.56504 14.9716 6.53983 14.6233 6.43338 14.2959C6.32694 13.9686 6.14245 13.672 5.89585 13.4319L2.15985 9.79489C2.08844 9.72593 2.03784 9.63829 2.01381 9.54197C1.98978 9.44565 1.99328 9.34451 2.02393 9.25008C2.05457 9.15566 2.11111 9.07174 2.18712 9.00788C2.26313 8.94402 2.35555 8.90279 2.45385 8.88889L7.61885 8.13389C7.9591 8.08439 8.28224 7.95295 8.56043 7.75088C8.83863 7.54881 9.06355 7.28216 9.21585 6.97389L11.5248 2.29489Z" stroke="#7CBB00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CommunityIcon = () => (
  <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 26.667C65.5228 26.667 70 22.1898 70 16.667C70 11.1441 65.5228 6.66699 60 6.66699C54.4772 6.66699 50 11.1441 50 16.667C50 22.1898 54.4772 26.667 60 26.667Z" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M20 50C25.5228 50 30 45.5228 30 40C30 34.4772 25.5228 30 20 30C14.4772 30 10 34.4772 10 40C10 45.5228 14.4772 50 20 50Z" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M60 73.333C65.5228 73.333 70 68.8559 70 63.333C70 57.8102 65.5228 53.333 60 53.333C54.4772 53.333 50 57.8102 50 63.333C50 68.8559 54.4772 73.333 60 73.333Z" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M28.6333 45.0332L51.4 58.2999" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M51.3666 21.7002L28.6333 34.9669" stroke="white" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function HowItWorksPage() {
  return (
    <>
      {/* Page Hero */}
      <section className="hiw-hero">
        <div className="hiw-hero-container">
          <h1>How It Works — In Just 4 Easy Steps</h1>
          <p>Our intelligent giving system automates generosity, allowing anyone to make an impact — with <span className="zero-highlight">zero out-of-pocket cost</span>.</p>
        </div>
      </section>

      {/* 4 Step Cards */}
      <section className="hiw-tabs">
        <div className="hiw-step-cards">
          <div className="hiw-step-card">
            <div className="hiw-step-icon">
              <GiftIcon />
            </div>
            <h3>Spread Kindness on Us</h3>
            <p>Get $250 with zero cost from your pocket to celebrate your birthday in style!</p>
            <a href="#step1" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">1</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon">
              <MedalIcon />
            </div>
            <h3>Become a Birthday Hero</h3>
            <p>Join a global movement and be honored worldwide for creating a lasting legacy.</p>
            <a href="#step2" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">2</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon hiw-icon-active">
              <ShareIcon />
            </div>
            <h3>Share Your Story</h3>
            <p>Use the world&apos;s first 100% community-first social platform to share your journey and spark change.</p>
            <a href="#step3" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">3</div>
          </div>

          <div className="hiw-step-card">
            <div className="hiw-step-icon hiw-icon-active">
              <FlameIcon />
            </div>
            <h3>Carry the Torch</h3>
            <p>Help carry forward the mission of saving lives for generations to come.</p>
            <a href="#step4" className="hiw-card-cta">Learn More →</a>
            <div className="hiw-step-number">4</div>
          </div>
        </div>
      </section>

      {/* Detailed Steps */}
      <div className="hiw-detailed-steps" id="detailedSteps">
        {/* Step 1: Spread Kindness */}
        <section className="hiw-step1" id="step1">
          <div className="hiw-container">
            <div className="hiw-step1-content">
              <div className="hiw-step-header">
                <div className="hiw-step-badge">1</div>
                <h2>Spread Kindness on Us</h2>
              </div>
              <p className="hiw-step-subtitle">Get <strong>$250</strong>, absolutely free, to celebrate your birthday in style!
Accept invitation/Sign up (it&apos;s free!) and instantly receive <strong>$250 in your Bsocio Wallet</strong></p>

              <ul className="hiw-checklist">
                <li>Pledge $50 each to five friends for their birthdays.</li>
                <li>Those same five friends pledge $50 back to you.</li>
                <li>On your birthday, you receive $250 — plus a $20 donation made in your name to feed a hungry child.</li>
                <li>Use your $250 however you like, or transfer it to your bank.</li>
              </ul>

              <div className="hiw-highlight-box">
                <DollarIcon />
                <div>
                  <h3>Zero Cost From Your Pocket</h3>
                  <p>Your $250 reward covers your pledge.
It&apos;s a win for you, a win for your friends, and a win for children everywhere.</p>
                </div>
              </div>
            </div>

            <div className="hiw-wallet-card">
              <WalletIcon />
              <h3>Your $250 Wallet</h3>
              <div className="hiw-wallet-footer">
                <HeartIcon />
                <p>A win-win for everyone</p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Birthday Hero */}
        <section className="hiw-step2" id="step2">
          <div className="hiw-container">
            <div className="hiw-step-header-centered">
              <div className="hiw-step-badge">2</div>
              <h2>Become a Birthday Hero</h2>
            </div>
            <p className="hiw-step-subtitle-centered">Your generosity earns you a place in the <strong>Birthday Hero Hall of Fame</strong>,
 celebrated globally at the <strong>Bsocio Hero Festival</strong>— hosted in <strong>California, New York, London</strong>, and more.</p>

            <p className="hiw-step-subtitle-centered" style={{ fontWeight: 600, color: 'var(--secondary-green)', marginTop: '2rem' }}>Experience the Celebration:</p>

            <div className="hiw-feature-grid">
              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <TrophyIcon />
                </div>
                <div>
                  <h3>Birthday Hero Index</h3>
                  <p>a live AI leaderboard of global kindness.</p>
                </div>
              </div>

              <div className="hiw-feature-card orange">
                <div className="hiw-feature-icon orange">
                  <CrownIcon />
                </div>
                <div>
                  <h3>Hunger Hero Crowning</h3>
                  <p>medals, recognition, and worldwide fame.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <AwardIcon />
                </div>
                <div>
                  <h3>Hunger Games Arena</h3>
                  <p>thrilling competitions for a cause.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <CakeIcon />
                </div>
                <div>
                  <h3>Giant Cake Parade</h3>
                  <p>the sweetest global celebration.</p>
                </div>
              </div>

              <div className="hiw-feature-card">
                <div className="hiw-feature-icon green">
                  <StarIcon />
                </div>
                <div>
                  <h3>Impact Stage</h3>
                  <p>surprise guests, celebrities, and humanitarian icons.</p>
                </div>
              </div>
            </div>

            <p className="hiw-step-subtitle-centered" style={{ marginTop: '2rem' }}>Your name, your story, and your kindness — all celebrated in the world&apos;s largest kindness festival.</p>
          </div>
        </section>

        {/* Step 3: Share Story */}
        <section className="hiw-step3" id="step3">
          <div className="hiw-container hiw-step3-layout">
            <div className="hiw-step3-visual">
              <div className="hiw-community-card">
                <CommunityIcon />
                <h3>Community First</h3>
                <p>Social Platform</p>
              </div>
            </div>

            <div className="hiw-step3-content">
              <div className="hiw-step-header">
                <div className="hiw-step-badge">3</div>
                <h2>Share Your Story</h2>
              </div>
              <p className="hiw-step-subtitle">Join the world&apos;s first <strong>AI-powered, community-first social platform</strong> built around purpose.</p>
              <p className="hiw-step-subtitle">Bsocio turns your birthday celebrations into stories that inspire and uplift.</p>
              <ul className="hiw-checklist">
                <li>Create your personalized impact feed.</li>
                <li>Invite friends and family to celebrate meaningfully.</li>
                <li>Connect with brands, creators, and changemakers.</li>
                <li>Share how your birthday powers purpose.</li>
              </ul>

              <p>Bsocio isn&apos;t just a platform. It&apos;s a movement of people who believe one day can change everything.</p>

              <div className="hiw-quote-box">
                <p>Your birthday isn&apos;t just about you anymore —
<strong>It&apos;s about the future you create.</strong></p>
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Carry the Torch */}
        <section className="hiw-step4" id="step4">
          <div className="hiw-container">
            <div className="hiw-step-header-centered">
              <div className="hiw-step-badge">4</div>
              <h2>Carry the Torch</h2>
            </div>
            <p className="hiw-step-subtitle-centered">Carry forward the mission of saving and improving lives for generations to come.

You don&apos;t need to be a billionaire to create a billionaire-level impact.</p>
            <p><strong>Your birthday alone can change lives</strong></p>

            <div className="hiw-scale-section">
              <div className="hiw-scale-card">
                <h3>How do you do it?</h3>
                <div className="hiw-scale-divider"></div>

                <div className="hiw-scale-content">
                  <div className="hiw-scale-item blue">
                    <p>Imagine you&apos;re 20 years old, with 60 birthdays ahead.</p>
                  </div>
                  <div className="hiw-scale-item green">
                    <p>Each year, <strong>$20</strong> is donated in your name to help end child hunger.</p>
                  </div>
                  <div className="hiw-scale-item orange">
                    <p>That&apos;s <strong>$1,200</strong> in lifetime impact—from birthdays you were already going to celebrate.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hiw-divider"></div>

            <div className="hiw-scale-text">
              <p className="hiw-scale-heading">Now, imagine this at scale.</p>
              <p>Every year, 245 million Americans exchange gifts, spending $162 billion—projected to reach $388 billion by 2027. If even a small fraction of the world&apos;s 5 billion social media users joined Bsocio, we could unlock <strong>$300 billion in lifetime giving</strong>— enough to end child hunger for good and carry forward the mission of saving lives beyond 2045.</p>
            </div>
          </div>
        </section>

        {/* Legacy Section */}
        <section className="hiw-legacy">
          <div className="hiw-container-wide">
            <h2>The Bsocio Impact Vision</h2>

            <div className="hiw-legacy-content">
              <div className="hiw-legacy-image">
                <Image
                  src="https://bsocio-bucket.s3.us-east-1.amazonaws.com/images/images/thinkinggirl.png"
                  alt="Thinking Girl"
                  width={500}
                  height={500}
                  quality={85}
                  sizes="(max-width: 768px) 100vw, 500px"
                  style={{ objectFit: 'cover' }}
                />
              </div>

              <div className="hiw-legacy-text">
                <p>These funds will build <strong style={{ color: '#F65314' }}>Bsocio Centres</strong> worldwide— named after the greatest humanitarian heroes of our time. Each centre will serve as a <strong>hub of innovation, learning, and opportunity,</strong> equipped with school feeding systems across <strong>100+ countries</strong>, delivering sustainable nutrition to <strong>500 million children every year.</strong> So no child ever has to learn on an empty stomach.</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* CTA Impact Section */}
      <CtaImpactSection />
    </>
  );
}
