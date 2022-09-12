from selenium import webdriver
from selenium.webdriver.common.keys import Keys
import time
import unittest

class NewVisitorTest(unittest.TestCase):

  def setUp(self):
    self.browser = webdriver.Firefox()

  def tearDown(self):
    self.browser.quit()

  def test_can_start_a_list_and_retreive_it_later(self):
    # Edith goes to homepage
    self.browser.get('http://localhost:8000')

    # She notices the page title and header mention to-do lists
    self.assertIn('To-Do', self.browser.title)
    header_text = self.browser.find_element_by_tag_name('h1').text
    self.assertIn('To-Do', header_text)

    # She is invited to enter a to-do item
    inputbox = self.browser.find_element_by_id('id_new_item')
    self.assertEqual(
      inputbox.get_attribute('placeholder'),
      'Enter a to-do item'
    )

    # She types "Buy peacock feathers" into a text box
    inputbox.send_keys('Buy peacock feathers')

    # When she hits enter, the page updates.  Now the page lists "1: Buy peacock feathers"
    # as an item in a to-do list
    inputbox.send_keys(Keys.ENTER)
    time.sleep(1)

    table = self.browser.find_element_by_id('id_list_table')
    rows = table.find_elements_by_tag_name('tr')
    self.assertTrue(
      any(row.text == '1: Buy peacock feathers' for row in rows),
      "New to-do item did not appear in table"
    )

    # There is still a textbox inviting her to add another item.
    # She enters "Use peacock feathers to make a fly"
    self.fail('Finish the test!')

    # The page updates again, and now she sees both items on her list

    # Edith Wonders weather the site will remember her list, then she sees that the site has
    # Generated a unique url for her.  There is some explanitory text to that effect.

    # She visits that URL.  her to-do list is still there.

if __name__ == '__main__':
    unittest.main(warnings='ignore')
