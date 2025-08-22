Feature: Login
    Scenario: Login with valid credentials
        Given I visit the login page
        When I fill in the valid username: "carlos" and password: "123"
        And I click the login button
        Then I should be logged in

    Scenario Outline: Login with valid credentials
        Given I visit the login page
        When I fill in the valid username: "<username>" and password: "<password>"
        And I click the login button
        Then I should not be logged in
        Examples:
            | username | password |
            | carlos   | 1234     | #invalid password
            | carlosX  | 123      | #invalid username

