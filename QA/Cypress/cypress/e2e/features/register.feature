Feature: Register
    Scenario: Register with valid Random credentials
        Given I visit the register page
        When I fill in register fields Random username and password: "123" and confirm password: "123"
        And I fill in a Random Full Name, Email, Password, Birth Date, Phone Number, CRP, CPF
        And I click the register button
        Then I should be registered
    
    Scenario Outline: Register users with random invalid data
        Given I visit the register page
        When I fill in register fields invalid Random username and password: "<password>" and confirm password: "<confirmPassword>"
        And I fill in a Invalid Full Name, Email, Password, Birth Date, Phone Number, CRP, CPF
        And I click the register button
        Then I should see error message
        Examples:
            | username | password | confirmPassword |
            | testuser | 123      | 123             |
            | newuser  | 321      | 321             |
            | admin    | admin123 | admin123        |