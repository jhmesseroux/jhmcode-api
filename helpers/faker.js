const { faker } = require('@faker-js/faker')
const { EXPERIENCE_TYPES, PROGRAMMING_SKILLS, MONTHS } = require('../constants')

exports.generateFakeData = (type) => {
  if (type === 'project') return fakeProject()
  if (type === 'user') return fakeUser()
  if (type === 'skill') return fakeSkill()
  if (type === 'experience') return fakeExperience()
}

fakeProject = () => ({
  level: faker.helpers.arrayElement(['Beginner', 'Intermediate', 'Advanced']),
  title: faker.lorem.text().slice(0, 100),
  description: faker.lorem.paragraph({ min: 3, max: 5 }),
  photo: faker.image.url({ width: 1280, height: 720 }),
  skills: faker.helpers.arrayElements(
    PROGRAMMING_SKILLS,
    Math.floor(Math.random() * 5) + 2
  ),
  startMonth: faker.helpers.arrayElement(MONTHS).name,
  startYear: faker.datatype.number({ min: 2010, max: 2023 }),
  endMonth: faker.helpers.arrayElement(MONTHS).name,
  endYear: faker.datatype.number({ min: 2010, max: 2023 }),
  demoLink: faker.internet.url(),
  gitBack: faker.internet.url(),
  gitFront: faker.internet.url(),
  collaborators: faker.helpers.arrayElements(
    ['Juan', 'Pedro', 'James', 'Jhmcode'],
    2
  ),
})

fakeExperience = () => ({
  title: faker.lorem.text().slice(0, 100),
  startMonth: faker.helpers.arrayElement(MONTHS).name,
  startYear: faker.datatype.number({ min: 2010, max: 2023 }),
  endMonth: faker.helpers.arrayElement(MONTHS).name,
  endYear: faker.datatype.number({ min: 2010, max: 2023 }),
  experienceType: faker.helpers.arrayElement(EXPERIENCE_TYPES),
  companyName: faker.company.name(),
  description: faker.lorem.paragraph({ min: 3, max: 5 }),
  location: faker.address.city(),
  skills: faker.helpers.arrayElements(
    PROGRAMMING_SKILLS,
    Math.floor(Math.random() * 5) + 2
  ),
})

fakeUser = () => ({
  username: faker.person.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement(['admin', 'user', 'client', 'helper']),
  photo: faker.image.avatar(),
  active: faker.helpers.arrayElement([true, false]),
})

fakeSkill = () => ({
  name: faker.helpers.arrayElement(PROGRAMMING_SKILLS),
})
