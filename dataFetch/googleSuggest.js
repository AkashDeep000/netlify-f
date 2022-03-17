import axios from "axios"

export default function googleSuggest(searchQuery) {
  
 const result = axios.get(`http://suggestqueries.google.com/complete/search?output=firefox&${searchQuery.country ? `hl=${searchQuery.searchCountry}` : null}&q=${searchQuery.searchTerm}`, {
            headers: {
                "user-agent": 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Mobile Safari/537.36'
            }
        }).then(function (response) {
    // handle success
    const data = response.data;
    const result = {
      searchTerm: data[0],
      suggestions: data[1]
    }
    
    return result
  })
  return result
}