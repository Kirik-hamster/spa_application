export default async function handler(req, res) {
  const { path, key, page, limit, dateFrom, dateTo } = req.query

  const targetUrl = `http://109.73.206.144:6969/api/${path}?key=${key}&page=${page}&limit=${limit}&dateFrom=${dateFrom}&dateTo=${dateTo}`

  try {
    const response = await fetch(targetUrl)
    const data = await response.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при запросе к API', details: error.message })
  }
}
