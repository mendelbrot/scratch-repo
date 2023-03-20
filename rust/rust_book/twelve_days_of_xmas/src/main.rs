const DAYS_OF_XMAS: [&str; 12] = [
  "first", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth",
  "eleventh", "twelfth",
];

const ITEMS: [&str; 12] = [
  "A Partridge in a pear tree",
  "Two Turtle doves",
  "Three French hens",
  "Four Colly birds",
  "Five Gold rings",
  "Six Geese a laying",
  "Seven Swans a swimming",
  "Eight Maids a milking",
  "Nine Drummers drumming",
  "Ten Pipers piping",
  "Eleven Ladies dancing",
  "Twelve Lords a leaping",
];

fn main() {
  for d in 0..DAYS_OF_XMAS.len() {
    let day = DAYS_OF_XMAS[d];

    println!("On the {} day of Christmas my true love gave to me:", day);
    let r = 0..=d;
    for i in r.rev() {
      if d > 0 && i == 0 {
        print!("And ")
      }

      print!("{}", ITEMS[i]);

      if i == 0 {
        println!(".")
      } else {
        println!(",")
      }
    }

    println!();
  }
}
