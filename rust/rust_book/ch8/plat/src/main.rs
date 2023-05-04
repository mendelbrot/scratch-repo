/*
converts input text to pig latin

rules:
  if a word starts with a consonant:
  - move initial consonant to the end
  - add "ay" to the end

  if a word starts with a vowel
  - add "hay" to the end
 */

use clap::Parser;

#[derive(Parser, Debug)]
struct Args {
    #[arg(short, long)]
    name: String,
}

fn main() {
    let args = Args::parse();
    println!("Hello {}!", args.name);
}
