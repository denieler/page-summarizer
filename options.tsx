import { useState, useCallback } from "react"
import { useStorage } from "@plasmohq/storage/hook"

import Typography from '@mui/joy/Typography'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import Input from '@mui/joy/Input'
import Button from '@mui/joy/Button'
import Alert from '@mui/joy/Alert'

function OptionsIndex() {
  const [openAIKey, setOpenAIKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)

  const [_, setOpenAIKeyStorage] = useStorage('openAIAPIKey')

  const handleSaveSettings = useCallback(() => {
    console.log("Saving settings...")
    setIsLoading(true)

    setOpenAIKeyStorage(openAIKey)
    
    setTimeout(() => {
      setShowAlert(true)
      setIsLoading(false)

      setTimeout(() => {
        setShowAlert(false)
      }, 3000)
    }, 1000)
  }, [openAIKey, setOpenAIKeyStorage])

  return (
    <Sheet sx={{ p: 2, width: "30em" }}>
      <Stack spacing={2}>
        <Typography level="h2" fontSize="md">
          Summarizer Options
        </Typography>

        {showAlert && (
          <Alert color="success">
            Setting saved successfully!
          </Alert>
        )}

        <Stack spacing={2}>
          <Typography>
            OpenAI API Key
          </Typography>

          <Input
            value={openAIKey}
            onChange={e => setOpenAIKey(e.target.value)}
            placeholder="sk-..."
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={handleSaveSettings}
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        </Stack>
      </Stack>
    </Sheet>
  )
}

export default OptionsIndex