Feature: Login
    Scenario: Login with valid credentials
        Given I visit the login page
        When I fill in the valid username: "carlos" and password: "123"
        And I click the login button
        Then I should be logged in

    Scenario: Login with empty username
        Given I visit the login page
        When I leave the username empty and fill the password: "123"
        And I click the login button
        Then I should not be logged in

    Scenario: Login with empty password
        Given I visit the login page
        When I fill the username: "carlos" and leave the password empty
        And I click the login button
        Then I should not be logged in

    Scenario: Logout from the system
        Given I visit the login page
        When I fill in the valid username: "carlos" and password: "123"
        And I click the login button
        And I click the logout button
        Then I should be logged out

    Scenario: Navigation to register page
        Given I visit the login page
        When I click the register link
        Then I should be on the register page

    Scenario Outline: Login with invalid credentials
        Given I visit the login page
        When I fill in the valid username: "<username>" and password: "<password>"
        And I click the login button
        Then I should not be logged in
        And I should see a login error message
        Examples:
            | username | password |
            | carlos   | 1234     |
            | carlosX  | 123      |



