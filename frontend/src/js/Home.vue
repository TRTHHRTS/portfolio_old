<template>
    <b-container fluid>
        <b-row>
            <b-col>
                <h1 style="text-align: center;">Welcome, friend!</h1>
                <hr/>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <a href="https://github.com/TRTHHRTS/portfolio_old" class="common_a_block rise_of_bots_block">
                    <b-jumbotron header="RISE OF BOTS project"
                                 lead="Bots play a mobile online game!"
                                 class="border">
                    </b-jumbotron>
                </a>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <router-link to="/htremote" class="common_a_block hts2_block">
                    <b-jumbotron header="Home Theater Server 2"
                                 lead="Server for android remote control app. For more information visit Google Play store"
                                 class="border border-primary">
                        <b-btn variant="success lg" href="https://play.google.com/store/apps/details?id=com.trueberry.htremote" target="_blank">Google Play page</b-btn>
                    </b-jumbotron>
                </router-link>
            </b-col>
            <b-col>
                <a href="#/hts" class="common_a_block hts_block">
                    <b-jumbotron header="HOME THEATER SERVER"
                                 lead="Server for Home Theater Remote android app. For more information visit website or Google Play store"
                                 class="border border-primary">
                        <b-btn variant="success lg" href="https://play.google.com/store/apps/details?id=com.trueberry.hometheatre" target="_blank">Google Play page</b-btn>
                    </b-jumbotron>
                </a>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <a href="https://github.com/TRTHHRTS/experimental_tutji_project" class="common_a_block tutji_block" target="_blank">
                    <b-jumbotron header="TUTJI (open source concept)" lead="Learn with talented people in your country, city or neighborhood"
                                 class="border border-warning">
                    </b-jumbotron>
                </a>
            </b-col>
            <b-col>
                <a class="common_a_block github_block" href="https://github.com/TRTHHRTS" target="_blank">
                    <b-jumbotron header="GitHub"
                                 lead="My open-source projects"
                                 class="border border-warning github_block">
                    </b-jumbotron>
                </a>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <b-jumbotron header="Contacts" lead="You can contact me by this" class="border border-info cont_block">
                    <div class="contactBlock">
                        <a href="https://vk.com/trthhrts" target="_blank"><img width="48" src="../static/vk.svg"/></a>
                        <a href="https://www.facebook.com/trthhtrts" target="_blank"><img width="48" src="../static/fb.svg"/></a>
                        <a href="https://twitter.com/TurokRUS" target="_blank"><img width="48" src="../static/twitter.svg"/></a>
                        <a href="https://www.instagram.com/trthhrtsx2" target="_blank"><img width="48" src="../static/instagram.svg"/></a>
                        <a href="https://github.com/TRTHHRTS" target="_blank"><img width="48" src="../static/github.svg"/></a>
                    </div>
                </b-jumbotron>
            </b-col>
        </b-row>
    </b-container>
</template>
<style lang="scss">
    .common_a_block {
        text-decoration: none;
        &:hover {text-decoration: none;}
        &:visited {text-decoration: none;}
        div {
            height: 250px;
            transition: .5s;
            color: white;
            background-size: cover !important;
            &:hover {
                box-shadow: 10px 10px 11px rgba(33,33,33,.4);
            }
        }
    }
    .telegram_bots_block {
        div {
            height: 150px;
            text-align: center;
            color: #0088CC;
            background: white;
            &:hover {
                background: #0088CC;
                color: white;
            }
        }
    }
    .rise_of_bots_block {
        div {
            height: 150px;
            text-align: center;
            color: #EA0037;
            background: white;
            &:hover {
                background: #EA0037;
                color: white;
            }
        }
    }
    .hts_block {
        div {
            text-align: center;
            background: url("../static/hts_wall.jpg") no-repeat;
            &:hover {
                color: rgb(0, 123, 255);
            }
        }
    }
    .hts2_block {
        div {
            background: url("../static/hts2_wall.jpg") no-repeat;
            text-align: center;
            &:hover {
                color: rgb(0, 123, 255);
            }
        }
    }
    .tutji_block {
        div {
            background: url("../static/tutji_wall.jpg") no-repeat;
            text-align: center;
            &:hover {
                color: rgb(255, 193, 7);
            }
        }
    }
    .github_block {
        div {
            text-align: center;
            background: url("../static/guthub_wall.jpg") no-repeat;
            &:hover {
                color: rgb(255, 193, 7);
            }
        }
    }
    .cont_block {
        min-height: 300px;
        color: white;
        background: url("../static/contacts_wall.jpg") no-repeat;
        background-size: cover;
        .contactBlock {
            background-color: white;
            text-align: center;
            display: table;
            padding: 10px;
            margin: 0 auto;
            margin-bottom: 10px;
            margin-top: 10px;
            border: 1px solid gray;
            border-radius: 40px;
            transition: .5s;
            &:hover {
                box-shadow: 0 0 25px rgba(255,255,255,.6);
            }
        }
    }
</style>