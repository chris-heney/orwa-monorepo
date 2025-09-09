import { Box, Button } from "@mui/material"
import {CategorySelect} from "./SelectComponent"

interface FilterProps {
    setLetterFilter: (letter: string) => void
    setCategoryFilter: (category: string) => void
    categoryFilter: string
  }
  
  const Filter: React.FC<FilterProps> = ({ setLetterFilter , setCategoryFilter, categoryFilter}) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const handleButtonClick = (letter: string) => {
    setLetterFilter(letter)
    console.log(`Button clicked: ${letter}`);
  };

  return (
    <Box sx={{mt: 3}} className="text-left">
      <Box className="flex flex-col md:flex-row items-center mb-1 justify-center gap-2">
        <div className="flex md:flex-wrap gap-1 w-full md:w-auto overflow-scroll md:overflow-auto justify-between lg:justify-start">
          {alphabet.split('').map((letter, index) => (
            <Button
              key={index}
              onClick={() => handleButtonClick(letter)}
              className="text-sky-700 hover:underline text-sm md:text-base lg:text-lg xl:text-xl"
              sx={{px: 0}}
              variant="outlined"
            >
              {letter}
            </Button>
          ))}
          <Button
            onClick={() => handleButtonClick('')}
            className="text-sky-700 hover:underline text-sm md:text-base lg:text-lg xl:text-xl whitespace-nowrap lg:max-w-fit"
            variant="contained"
            sx={{px: 3, flexGrow: 1}}
          >
            All
          </Button>
        </div>
      </Box>
      <CategorySelect categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} />
    </Box>
  )
}

export default Filter
