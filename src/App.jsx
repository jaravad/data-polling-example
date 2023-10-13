import { useState } from 'react'
import './App.css'


function App() {
  const [loading] = useState(false);
  const [formValues, setFormValues] = useState({
    text: '',
    'enable_subtitles': true,
    'number_of_titles': '1'
  });

  const handleChange= (e) => {
    const {value} = e.target;
    setFormValues(prev => ({...prev, [e.target.name]: value}))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(formValues)
  }

  return (
    <>
      <h1>Crear opciones de títulos</h1>
      <form action="" onSubmit={handleSubmit}>
        <textarea name="text" id="text" cols="30" rows="10" style={{display: 'block', width: '100%'}} value={formValues.text} onChange={handleChange} />
        <label htmlFor="enable_subtitles">Crear un subtítulo para cada título</label>
        <input type="checkbox" name="enable_subtitles" id="enable_subtitles" onChange={handleChange} checked={formValues.enable_subtitles}/>
        <select name="number_of_titles" id="number_of_titles" style={{width: '100%'}} value={formValues.number_of_titles} onChange={handleChange}>
          <option value={Number(1)}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
        </select>
        <button type='submit'>Crear titulos</button>
      </form>

      {loading && 'Cargando...'}
      
    </>
  )
}

export default App
