import { contributors, socialLinks } from '../../constants/constants';

const Footer = () => (
  <footer className="flex w-[76rem] justify-between p-8 m-auto border-t text-house-green">
    <span className="font-bold">© 2023 Lesser. All rights reserved.</span>
    <ul className="flex items-center">
      {contributors.map((contributor, index) => (
        <li
          key={index}
          className={`flex h-4 px-3 items-center ${index !== contributors.length - 1 && 'border-r border-house-green'}`}
        >
          <a className="hover:font-bold" href={contributor.link} target="_blank">
            {contributor.name}
          </a>
        </li>
      ))}
    </ul>
    <ul className="flex gap-3">
      {socialLinks.map((socialLink, index) => (
        <li key={index}>
          <a href={socialLink.link} target="_blank">
            {socialLink.icon}
          </a>
        </li>
      ))}
    </ul>
  </footer>
);

export default Footer;
