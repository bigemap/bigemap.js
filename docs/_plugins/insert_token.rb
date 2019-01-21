module InsertToken
    def insert_token(input)
        input.sub("<script>", "<script>\nL.bigemap.accessToken = '<your access token here>';")
             .sub("<script type='text/coffeescript'>", "<script type='text/coffeescript'>\nL.bigemap.accessToken = '<your access token here>'")
    end
end

Liquid::Template.register_filter(InsertToken)
