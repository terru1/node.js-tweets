const path = require('path');
const csvWriter = require('csv-writer').createObjectCsvWriter;

try {
  const tweets = require('./tweets');
  const tweets_final = tweets.tweets
    .filter((t) => {
      if (
        t.tweet.in_reply_to_screen_name ||
        t.tweet.full_text.startsWith('RT', 0) ||
        t.tweet.full_text.startsWith('@', 0)
      ) {
        return false;
      }
      return true;
    })
    .map((t) => ({ tweet: t.tweet.full_text, date: t.tweet.created_at }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const writer = csvWriter({
    path: path.resolve(__dirname, 'tweets.csv'),
    header: [{ id: 'tweet', title: 'tweet' }],
  });

  writer.writeRecords(tweets_final).then(() => {
    console.log('CSV file successfully written');
  });
} catch (err) {
  console.error('Error:', err);
}
