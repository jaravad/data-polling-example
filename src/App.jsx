import { useState, useEffect, useRef } from 'react'
import {
  Button,
  Select,
  TextareaAutosize,
  Typography,
  InputLabel,
  MenuItem,
  Checkbox,
  CircularProgress,
  Container,
  Box,
} from '@mui/material'

const API_URL = 'https://test-copilot-28392d63a473.herokuapp.com/titles'

function App() {
  const [loading, setLoading] = useState(false)
  const [jobId, setJobId] = useState(null)
  const [formValues, setFormValues] = useState({
    text: 'El Metropolitan Museum de Nueva York (MET) inauguró este jueves 7 de septiembre la exposición “Art for the Millions: American Culture and Politics in the 1930s”, que muestra los diferentes ángulos artísticos en EE. UU. en la década de los 30 del siglo XX. La muestra recoge portadas de revistas, tanto sindicales como de moda, pósters con propaganda de las políticas sociales del Gobierno, litografías de artistas desconocidos, óleos de algunos más consagrados como Georgia O’Keeffe y hasta objetos como algunos de los primeros electrodomésticos aparecidos en aquella época.',
    enable_subtitles: true,
    number_of_titles: 3,
  })
  const [result, setResult] = useState(null)
  const myInterval = useRef(null)

  const handleChange = (e) => {
    let value
    if (e.target.name === 'enable_subtitles') {
      value = e.target.checked
    } else {
      value = e.target.value
    }
    setFormValues((prev) => ({ ...prev, [e.target.name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = {
      ...formValues,
      number_of_titles: formValues.number_of_titles,
    }
    setLoading(true)
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    if (response.ok) {
      const parsedResponse = await response.json()
      setJobId(parsedResponse.result_id)
      console.log(parsedResponse)
    }
  }

  useEffect(() => {
    if (jobId != null) {
      if (!myInterval.current) {
        try {
          myInterval.current = setInterval(async () => {
            console.log(`${API_URL}${'/result/'}${jobId}`)
            const response = await fetch(`${API_URL}/result/${jobId}`)
            if (response.ok) {
              const parsedResponse = await response.json()
              const { ready, value } = parsedResponse

              console.log(parsedResponse)
              setResult(value)
              if (ready) {
                clearInterval(myInterval.current)
                myInterval.current = null
                setJobId(null)
                setLoading(false)
              }
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
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" mb={3}>
        Crear opciones de títulos
      </Typography>
      <form action="" onSubmit={handleSubmit}>
        <TextareaAutosize
          name="text"
          id="text"
          style={{ width: '100%' }}
          value={formValues.text}
          onChange={handleChange}
        />
        <Box display="flex" alignItems="center">
          <Checkbox
            type="checkbox"
            name="enable_subtitles"
            id="enable_subtitles"
            onChange={handleChange}
            checked={formValues.enable_subtitles}
          />
          <InputLabel htmlFor="enable_subtitles">
            Crear un subtítulo para cada título
          </InputLabel>
        </Box>
        <Select
          name="number_of_titles"
          id="number_of_titles"
          style={{ width: '100%' }}
          sx={{ mb: 3 }}
          value={formValues.number_of_titles}
          onChange={handleChange}
        >
          <MenuItem value={1}>1</MenuItem>
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={3}>3</MenuItem>
          <MenuItem value={4}>4</MenuItem>
          <MenuItem value={5}>5</MenuItem>
        </Select>
        <Button type="submit" disabled={loading} variant="contained">
          Crear titulos
        </Button>
      </form>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          {result && (
            <ul>
              {result.map((item, index) => {
                return (
                  <li key={index}>
                    {Object.keys(item).map((key) => (
                      <Typography paragraph key={key}>
                        <strong>{key}: </strong>
                        {item[key]}
                      </Typography>
                    ))}
                  </li>
                )
              })}
            </ul>
          )}
        </>
      )}
    </Container>
  )
}

export default App
