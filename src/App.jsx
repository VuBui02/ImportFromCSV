import {useState} from 'react'
import { parse } from 'papaparse'
import axios from 'axios';

function App() {
  const [listCV, setListCV] = useState([])
  
  function handleFileSelect(evt) {
    let file = evt.target.files[0];
  
    parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function(results) {
        const initialListCV = []
        results.data.map((item) => {
          let initialCV = {
            birthday: item.birthday,
            certificate: item.certificate,
            email: item.email,
            name: item.email.split('@')[0],
            gender: item.gender,
            phone: item.mobile,
            college: item.university,
            filename: item.email.split('@')[0].toLowerCase(),
          }
          initialListCV.push(initialCV)
        })
        setListCV(initialListCV)
      }
    });
  }

  const handleSubmit = async() => {
    await axios.post('https://mcv-backend.rkincubator.dev/graphql', {
      query: `mutation InsertCVs($input: [InsertCVsInput]) {
        insertCVs(input: $input)
      }`,
      variables: {
        input: listCV
      }
    }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }

  return (
    <>
    <input
      type="file"
      id="csv-file"
      name="files"
      onChange={(e) => handleFileSelect(e)}
    />
    <button onClick={handleSubmit}>Submit</button>
    </>
  )
}

export default App
