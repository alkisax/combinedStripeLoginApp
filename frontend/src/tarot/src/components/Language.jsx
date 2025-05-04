import 'bootstrap/dist/css/bootstrap.min.css';

import { useState } from "react";

const Language = ({ lang, setLang }) => {
  const [ selectedLang, setSelectedLang ] = useState(lang)

  const handleLangChange = (event) => {
    const value = event.target.value;
    setSelectedLang(value); 
    if (value === 'gr') {
      setLang('gr');
    } else {
      setLang('el');
    } 
  };

  return (
    <div className="mb-3 d-flex justify-content-lg-start">
      <div className="form-check form-check-inline" >
        <input
          type="radio"
          id="en"
          name="lang"
          value="en"
          onChange={handleLangChange}
          checked={selectedLang === 'en'}
        />
        <label htmlFor="en" className="form-check-label"><img src="/images/small_Flag_of_Liberia.png" style={{ height: '1em', marginRight: '8px' }} />english </label>
      </div>

      <div className="form-check form-check-inline" >
        <input
          type="radio"
          id="gr"
          name="lang"
          value="gr"
          onChange={handleLangChange}
          checked={selectedLang === 'gr'}
        />
        <label htmlFor="gr" className="form-check-label"><img src="/images/small_Cretan_State.png" style={{ height: '1em', marginRight: '8px' }} />greek</label>
      </div> 
    </div>
  )
}
export default Language