# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)


# User.destroy_all

 20.times do
     User.create(
         username:  "#{Faker::Name.first_name}",
         email: Faker::Internet.free_email,
         password: "demodemo"
     )
 end

ids= [];
User.all.each do |user| 
    ids << user.id
end

50.times do
    body = Faker::Lorem.paragraph(sentence_count: 20)
    snippet = body[0..99]
    title = "#{Faker::NatoPhoneticAlphabet.code_word} #{Faker::Coffee.blend_name} #{Faker::House.furniture}" 
    Article.create(
        title: title,
        body: body,
        snippet: snippet,
        user_id: ids.sample
    )
end


 50.times do
     title = "#{Faker::NatoPhoneticAlphabet.code_word} #{Faker::Company.profession}"
     description = Faker::Lorem.sentence(word_count: 12)
     ImagePost.create(
         title: title,
         description: description,
         user_id: ids.sample,
         image_url:  "https://picsum.photos/id/#{rand(500)}/500/"
     )
 end

article_ids = []
Article.all.each do |article|
    article_ids.push(article.id)
end

image_ids = []
ImagePost.all.each do |image|
    image_ids.push(image.id)
end

100.times do
    body =  Faker::Lorem.paragraph(sentence_count: rand(4..8))
    Comment.create(
        post_type: "ImagePost",
        post_id: image_ids.sample,
        user_id: ids.sample,
        body: body
    )
end

100.times do 
    body =  Faker::Lorem.paragraph(sentence_count: rand(4..8))
    Comment.create(
        user_id: ids.sample,
        body: body,
        post_id: article_ids.sample,
        post_type: "Article"
    )
end
