//set a random playing game every X whatever
module.exports.config = {
  name: 'activity',
  invokers: ['activity'],
  help: 'Allows to randomly/manually set an activity',
  expandedHelp:
    'Format is `{TYPE} ACTIVITY MESSAGE`\nPLAYING, STREAMING, LISTENING, WATCHING\nBot owner only.',
  usage: [
    'Random one',
    'activity',
    'Manual',
    'activity something blah',
    'Manual and custom',
    '{streaming} the bee movie',
  ],
  invisible: true,
}

const statuses = [
  'with Mediawiki!',
  'on Bulbapedia!',
  "I'm #1!",
  'フシギダネ',
  'with some random facts',
  'with "fun" facts',
  '"thanks", bulbapedia',
  'Pick me!',
  '{streaming} the pokeyman anime!',
  '{streaming} pokerman',
  '{streaming} the Digimon anime',
  "{streaming} Brock's 10/10 abs",
  '{streaming} a high class battle!',
  '{streaming} a Bulbasaur yelling for 10h straight',
  'Bul!',
  'Ba!',
  'Bulba!',
  'Saur!',
  'Bulbasaur!',
  'alone',
  'Pokemon Sun',
  'Pokemon Moon',
  'Pokemon Mystery Dungeon',
  'Pokemon Pearl!',
  'as a bulbasaur',
  'as an Ivysaur (I wish)',
  'as a Venusaur (One day...)',
  "in Kanto's hidden garden",
  '{streaming} the Bulba-by',
  'in fuck yeah grass',
  '<one more level...>',
  'in the sun!',
  '{streaming} the Twitch logout page.',
  '{streaming} Playing',
  'Streaming',
  'does anyone read this?',
  '{streaming} 24/7 Lo-Fi hiphop beats to debug to',
]

//strings starting with '{streaming}' will be shown as "Streaming X"
const appendMsg = ' | bulba help | p?help' //use this to keep a constant message after
const interval = 60 * 15 //in seconds
const twitch = 'https://twitch.tv/logout' //memes
let interv

module.exports.events = {}

module.exports.events.ready = bot => {
  bot.user.setActivity(...getPlaying())

  interv = setInterval(
    () => bot.user.setActivity(...getPlaying()),
    interval * 1000,
  )
}

module.exports.events.message = (bot, message) => {
  if (message.author.id !== bot.sleet.config.owner.id)
    return message.channel.send('Nah, how about I do what I want.')

  let [cmd, ...playing] = bot.sleet.shlex(message)
  playing = playing.join(' ')

  let activity = playing ? getPlayingFrom(playing) : getPlaying()

  bot.user.setActivity(...activity)

  if (playing) {
    clearInterval(interv)
  } else {
    interv = setInterval(
      () => bot.user.setActivity(...getPlaying()),
      interval * 1000,
    )
  }

  bot.user.setActivity(...activity)

  message.channel.send(
    `Now *${activity[1].type.toLowerCase()}* **${activity[0]}**`,
  )
}

function getPlaying() {
  return getPlayingFrom(randomChoice(statuses), true)
}

// Returns [name, {url, type}]
function getPlayingFrom(str, append = false) {
  let choice = str.match(/(?:{(\w+)})?(.*)/)

  let name = (choice[2] + (append ? appendMsg : '')).trim()
  let type = (choice[1] || 'PLAYING').toUpperCase()
  let url = type === 'STREAMING' ? twitch : undefined

  return [name, { url, type }]
}

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
