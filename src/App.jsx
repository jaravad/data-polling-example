import { useState, useEffect, useRef } from 'react'
import './App.css'

const API_URL = 'http://localhost:3000/titles'

function App() {
  const [loading, setLoading] = useState(false);
  const [jobId, setJobId] = useState(null)
  const [formValues, setFormValues] = useState({
    text: 'El Metropolitan Museum de Nueva York (MET) inauguró este jueves 7 de septiembre la exposición “Art for the Millions: American Culture and Politics in the 1930s”, que muestra los diferentes ángulos artísticos en EE. UU. en la década de los 30 del siglo XX. La muestra recoge portadas de revistas, tanto sindicales como de moda, pósters con propaganda de las políticas sociales del Gobierno, litografías de artistas desconocidos, óleos de algunos más consagrados como Georgia O’Keeffe y hasta objetos como algunos de los primeros electrodomésticos aparecidos en aquella época.',
    'enable_subtitles': true,
    'number_of_titles': '1'
  });
  const [result, setResult] = useState(null)
  const myInterval = useRef(null)

  const handleChange= (e) => {
    const {value} = e.target;
    setFormValues(prev => ({...prev, [e.target.name]: value}))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {...formValues, number_of_titles: Number(formValues.number_of_titles)}
    setLoading(true)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if(response.ok) {
      const parsedResponse = await response.json();
      setJobId(parsedResponse.result_id)
      console.log(parsedResponse)
    }
  }

  useEffect(()=>{
    if(jobId != null) {
      if (!myInterval.current) {
        try {
          myInterval.current = setInterval(async ()=>{
            console.log(`API_URL${'/result/'}${jobId}`)
            const response = await fetch(`${API_URL}/result/${jobId}`)
            if (response.ok) {
              const parsedResponse = await response.json();
              setResult(parsedResponse)
              clearInterval(myInterval.current)
              setLoading(false)
            }
          }, 5000)
        } catch (error) {
          console.log(error)
          if (myInterval.current) {
            clearInterval(myInterval.current)
            setLoading(false)
          }
        }
        
      }
    }
  }, [jobId])

  return (
    <>
      <h1>Crear opciones de títulos</h1>
      <form action="" onSubmit={handleSubmit}>
        <textarea name="text" id="text" cols="30" rows="10" style={{display: 'block', width: '100%'}} value={formValues.text} onChange={handleChange} />
        <label htmlFor="enable_subtitles">Crear un subtítulo para cada título</label>
        <input type="checkbox" name="enable_subtitles" id="enable_subtitles" onChange={handleChange} checked={formValues.enable_subtitles}/>
        <select name="number_of_titles" id="number_of_titles" style={{width: '100%'}} value={formValues.number_of_titles} onChange={handleChange}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        <button type='submit' disabled={loading}>Crear titulos</button>
      </form>
      {loading && 'Cargando...'}
      {jobId && <code>jobId: {jobId}</code>}
      {result && <code>
        {JSON.stringify(result)}
      </code>}
      
    </>
  )
}

export default App
