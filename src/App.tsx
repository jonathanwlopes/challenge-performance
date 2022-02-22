import { useCallback, useEffect, useState } from "react"

import { SideBar } from "./components/SideBar"
import { Content } from "./components/Content"

import { api } from "./services/api"

import "./styles/global.scss"

import "./styles/sidebar.scss"
import "./styles/content.scss"

interface GenreResponseProps {
  id: number
  name: "action" | "comedy" | "documentary" | "drama" | "horror" | "family"
  title: string
}

interface MovieProps {
  imdbID: string
  Title: string
  Poster: string
  Ratings: Array<{
    Source: string
    Value: string
  }>
  Runtime: string
}

export function App() {
  const [selectedGenreId, setSelectedGenreId] = useState(1)

  const [genres, setGenres] = useState<GenreResponseProps[]>([])

  const [movies, setMovies] = useState<MovieProps[]>([])
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps)

  useEffect(() => {
    api.get<GenreResponseProps[]>("genres").then((response) => {
      // Realizar as formatações dos dados sempre no momento que se busca os dados e não no momento da renderização do componente.
      const newData = response.data.map((genre) => {
        return {
          ...genre,
          formattedData: new Intl.DateTimeFormat("pt-BR").format(new Date()),
        }
      })

      setGenres(newData)
    })
  }, [])

  useEffect(() => {
    api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`).then((response) => {
      setMovies(response.data)
    })

    api.get<GenreResponseProps>(`genres/${selectedGenreId}`).then((response) => {
      setSelectedGenre(response.data)
    })
  }, [selectedGenreId])

  // Quando criamos uma função e ela será repassada para elementos filhos da nossa aplicação, é importante que ela utilize o useCallback
  const handleClickButton = useCallback((id: number) => {
    setSelectedGenreId(id)
  }, [])

  return (
    <div style={{ display: "flex", flexDirection: "row" }}>
      <SideBar genres={genres} selectedGenreId={selectedGenreId} buttonClickCallback={handleClickButton} />

      <Content selectedGenre={selectedGenre} movies={movies} />
    </div>
  )
}
