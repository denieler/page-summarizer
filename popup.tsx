import '@fontsource/public-sans'

import { useState, useCallback } from 'react'
import Button from '@mui/joy/Button'
import Sheet from '@mui/joy/Sheet'
import Stack from '@mui/joy/Stack'
import Typography from '@mui/joy/Typography'

import { useStorage } from "@plasmohq/storage/hook"

import { summarizeByOpenAI } from './openai'

const getInnerText = () => {
  return document.body.innerText
}

function IndexPopup() {
  const [summaryText, setSummaryText] = useState('Summary of the page goes here...')

  const [openAIKey] = useStorage('openAIAPIKey')
  
  const handleSummarizePageClick = useCallback(async () => {
    console.log('Summarizing page...')

    chrome.tabs.query({
      active: true,
      currentWindow: true
    }, async tabs => {
      if (tabs && tabs.length > 0) {
        var activeTab = tabs[0]
  
        const injectionResults = await chrome.scripting.executeScript({
          target : { tabId: activeTab.id },
          func: getInnerText
        })

        var tabContent = injectionResults[0].result
  
        setSummaryText('')

        await summarizeByOpenAI(tabContent, openAIKey, chunk => {
          setSummaryText(value => value + chunk)
        })
      }
    })    
  }, [openAIKey, summaryText, summarizeByOpenAI])

  return (
    <Sheet sx={{ p: 2, minWidth: "30em" }}>
      <Stack direction='row' spacing={2} justifyContent='space-between' alignItems='center' sx={{ mb: 3 }}>
        <Typography level="h2" fontSize="md">
          Summarizer
        </Typography>

        <Button
          variant="solid"
          size="md"
          color="primary"
          aria-label="Explore Bahamas Islands"
          sx={{ ml: 'auto', fontWeight: 600 }}
          onClick={handleSummarizePageClick}
        >
          Summarize Page
        </Button>
      </Stack>

      <Sheet sx={{ minHeight: "10em" }}>
        <Typography level="body1">
          {summaryText}
        </Typography>
      </Sheet>
    </Sheet>
  )
}

export default IndexPopup
