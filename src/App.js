import { useState } from 'react'

const initialFriends = [
  {
    id: 118836,
    name: 'Clark',
    image: 'https://i.pravatar.cc/48?u=118836',
    balance: -7,
  },
  {
    id: 933372,
    name: 'Sarah',
    image: 'https://i.pravatar.cc/48?u=933372',
    balance: 20,
  },
  {
    id: 499476,
    name: 'Anthony',
    image: 'https://i.pravatar.cc/48?u=499476',
    balance: 0,
  },
]

export default function App() {
  const [friends, setFriends] = useState(initialFriends)
  const [showAddFriend, setShowAddFriend] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState(null)

  function handleShowAddFriend() {
    setShowAddFriend((show) => !show)
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend])
    setShowAddFriend(false)
  }

  function handleSelectFriend(friend) {
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend))
    setShowAddFriend(false)
  }

  function handleSplitBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    )

    setSelectedFriend(null)
  }

  return (
    <div className='app'>
      <div className='sidebar'>
        <FriendList
          friends={friends}
          onSelect={handleSelectFriend}
          selectedFriend={selectedFriend}
        />
        <FormAddFriend
          onAddFriend={handleAddFriend}
          selectedFriend={selectedFriend}
        />

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? 'Close' : 'Add Friend'}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill friend={selectedFriend} onSplitBill={handleSplitBill} />
      )}
    </div>
  )
}

function FriendList({ friends, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  )
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id

  return (
    <li className={isSelected ? 'selected' : ''}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className='red'>
          You owe {friend.name} {friend.balance}
        </p>
      )}

      <Button onClick={() => onSelect(friend)}>
        {isSelected ? 'Close' : 'Select'}
      </Button>
    </li>
  )
}

function Button({ children, onClick }) {
  return (
    <button className='button' onClick={onClick}>
      {children}
    </button>
  )
}

function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState('')
  const [image, setImage] = useState('https://i.pravatar.cc/48')

  function handleSubmit(e) {
    e.preventDefault()

    if (!name || !image) return

    const id = crypto.randomUUID()

    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    }

    onAddFriend(newFriend)

    setName('')
    setImage('https://i.pravatar.cc/48')
  }

  return (
    <form className='form-add-friend' onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type='text'
        onChange={(e) => setName(e.target.value)}
        value={name}
      />

      <label>🖼️ Image Url</label>
      <input
        type='text'
        onChange={(e) => setImage(e.target.value)}
        value={image}
      />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState('')
  const [paidByUser, setPaidByUser] = useState('')
  const paidByFriend = bill ? bill - paidByUser : ''
  const [whoIsPaying, setWhoIsPaying] = useState('user')

  function handleSubmit(e) {
    e.preventDefault()

    if (!bill || !paidByUser) return

    onSplitBill(whoIsPaying === 'user' ? paidByFriend : -paidByUser)
  }

  return (
    <form className='form-split-bill' onSubmit={handleSubmit}>
      <h2>Split a bill with X</h2>

      <label>💲Bill Value</label>
      <input
        type='text'
        value={friend.balance}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🙎Your expense</label>
      <input
        type='text'
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(e.target.value) > bill ? paidByUser : Number(e.target.value)
          )
        }
      />

      <label>🧑‍🤝‍🧑{friend.name}'s expense</label>
      <input type='text' disabled value={paidByFriend} />

      <label>😊 Who is paying the bill</label>

      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(Number(e.target.value))}
      >
        <option value='user'>You</option>
        <option value='friend'>{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}
