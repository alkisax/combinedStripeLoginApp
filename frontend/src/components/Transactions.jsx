import axios from 'axios'
import { useState, useEffect } from 'react'
import { Table } from 'react-bootstrap'


const Transactions =  ({ url }) => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const token = localStorage.getItem("token")
        const response = await axios.get(`${url}/transaction`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setTransactions(response.data.data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [url])

  const toggleShowAll = () => {
    setShowAll(!showAll)
  }

  const markProcessed = async (transactionId, isProcessed) => {
        try {
          const token = localStorage.getItem("token")
          const response = await axios.get(`${url}/transaction`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          setTransactions(response.data.data)
          setLoading(false)
        } catch (error) {
          console.error("Error fetching transactions:", error)
          setLoading(false)
        }
  }

  return (
    <>
      {loading && <p>Loading...</p>}
      {!loading && transactions.length === 0 && <p>No transactions found</p>}
      <button id='showAllBtnTransactions' onClick={toggleShowAll}>{showAll ? "show only unprocessed" : "show all" }</button>
      <ul>
        {!loading && transactions.length !== 0 && 
          transactions
          .filter(t => showAll || !t.processed)
          .map((transaction) => {
            const participant = transaction.participant
            return (
              <li key={transactions._id}>
              {participant?.name || 'No Name'} - {participant?.surname || 'No Surname'} - {participant?.email || 'No Email'} - €{transaction.amount}  - {transaction.processed ? 'Processed' : 'Unprocessed'} - {new Date(transaction.createdAt).toLocaleString()}
              <button id='markProcessedBtn' onClick={() => markProcessed(transaction._id, transaction.processed)}>{transaction.processed ? 'mark unprocessed' : 'mark processed'} </button>
              </li>
            )
          })
        } 
      </ul>
    </>
  )
}

export default Transactions